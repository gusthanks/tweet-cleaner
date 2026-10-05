const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require.resolve('../delete-tweets.js'),'utf8');
function harness(responses=[],storage=new Map(),options={}) {
 const nodes=new Map(),calls=[],scrolls=[];let clock=0;
 const shadow={set innerHTML(html){for(const [,id] of html.matchAll(/id="([^"]+)"/g))nodes.set(id,{checked:id==='dry',value:id==='mode'?'timeline':'',style:{},dataset:{},focus(){}});},getElementById:id=>nodes.get(id)};
 const doc={cookie:'ct0=TEST_ONLY',body:{appendChild(){}},documentElement:{scrollHeight:600},querySelectorAll:()=>[],createElement:()=>({style:{},attachShadow:()=>shadow}),querySelector:()=>({getAttribute:()=>'/sample_user'})};
 const root={document:doc,location:{hostname:'x.com',pathname:options.pathname||'/sample_user'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},navigator:{locks:{request:async(k,o,fn)=>fn({})}},prompt:()=>options.phrase||'EXCLUIR @sample_user',alert:()=>{},setTimeout:(fn,ms)=>{clock+=ms;setImmediate(fn);},fetch:async(url,options)=>{calls.push({url,options});const op=url.split('/').at(-1),fields={DeleteTweet:'delete_tweet',DeleteRetweet:'unretweet',DeleteBookmark:'tweet_bookmark_delete',UnfavoriteTweet:'unfavorite_tweet'};const r=responses.shift()||{status:200,body:{data:{[fields[op]]:['DeleteBookmark','UnfavoriteTweet'].includes(op)?'Done':{}}}};return {status:r.status,json:async()=>r.body,headers:{get:()=>null}};}};
 class FakeDate extends Date {static now(){return clock;}}
 root.scrollY=0;root.innerHeight=600;root.scrollTo=(...args)=>scrolls.push(args);root.scrollBy=(...args)=>scrolls.push(args);
 vm.runInNewContext(source,{window:root,Date:FakeDate,AbortSignal,URL,Blob,console});
 return {nodes,calls,storage,root,scrolls,async archive(count=2){nodes.get('mode').value='archive';nodes.get('files').files=[{text:async()=>JSON.stringify(Array.from({length:count},(_,i)=>({tweet:{id_str:String(i+1)}})))}];await nodes.get('files').onchange();}};
}
function article(id,author='other_example',markers=[],warning={}){
 const article={querySelector:selector=>selector.includes('time')?{closest:()=>({getAttribute:()=>'/'+author+'/status/'+id})}:markers.some(marker=>selector==='[data-testid="'+marker+'"]')?{}:null};
 const container={parentElement:article,querySelector:()=>null,querySelectorAll:()=>warning.noShow?[]:[{textContent:'Show'}]};
 article.querySelectorAll=()=>warning.label?[{textContent:warning.label,parentElement:container,closest:()=>warning.quoted||warning.inText?{}:null}]:[];
 return article;
}
test('simulation sends zero requests and stores no completed IDs',async()=>{
 const h=harness();await h.archive();await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);assert.equal(h.storage.has('tweet-cleaner:v2:sample_user'),false);
});
test('successful IDs persist and rerun skips them',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();assert.equal(h.calls.length,2);
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,2);
 assert.deepEqual(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user')).done,['tweet:1','tweet:2']);
 for(const c of h.calls){assert.ok(c.url.startsWith('https://x.com/'));assert.equal(c.options.credentials,'include');}
});
test('auth failure stops queue without checkpointing failed ID',async()=>{
 const h=harness([{status:403,body:{errors:[{message:'Forbidden'}]}}]);await h.archive();h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);assert.equal(h.storage.has('tweet-cleaner:v2:sample_user'),false);assert.match(h.nodes.get('status').textContent,/HTTP 403/);
});
test('ambiguous HTTP success never saved; failed IDs retried next run',async()=>{
 const h=harness([{status:200,body:{}},{status:200,body:{data:{delete_tweet:{}}}}]);await h.archive();h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();assert.deepEqual(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user')).done,['tweet:2']);await h.nodes.get('start').onclick();assert.equal(h.calls.length,3);
});
test('account navigation blocks subsequent requests',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;h.root.location.pathname='/someoneelse';await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
});
test('stop finishes only the in-flight request',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;
 const fetch=h.root.fetch;h.root.fetch=async(...args)=>{const result=await fetch(...args);h.root.TweetCleaner.stop();return result;};
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);
 assert.deepEqual(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user')).done,['tweet:1']);
});
test('concurrent run cannot acquire lock and sends zero requests',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;h.root.navigator.locks.request=async(k,o,fn)=>fn(null);
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);assert.match(h.nodes.get('status').textContent,/outra aba/);
});
test('storage failure aborts instead of silently losing checkpoint',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;h.root.localStorage.setItem=()=>{throw Error('quota exceeded');};
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);assert.match(h.nodes.get('status').textContent,/quota exceeded/);
});
test('simulation exceeds 500; deletion reuses archive cache after reload',async()=>{
 const h=harness();await h.archive(505);await h.nodes.get('start').onclick();
 assert.equal(h.calls.length,0);assert.equal(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user:preview')).items.length,505);
 const next=harness([],h.storage);next.nodes.get('mode').value='archive';next.nodes.get('dry').checked=false;
 await next.nodes.get('start').onclick();assert.equal(next.calls.length,505);assert.equal(next.scrolls.length,0);
 assert.equal(JSON.parse(next.storage.get('tweet-cleaner:v2:sample_user')).done.length,505);
 assert.match(next.nodes.get('status').textContent,/Execução concluída/);
});
test('archive completes over 500 in one run; rerun skips all successes',async()=>{
 const h=harness();await h.archive(505);h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,505);
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,505);
});
test('server retries continue beyond 500 requests',async()=>{
 const responses=Array.from({length:499},()=>({status:200,body:{data:{delete_tweet:{}}}}));responses.push({status:503,body:{}});
 const h=harness(responses);await h.archive(505);h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,506);
 assert.equal(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user')).done.length,505);
 assert.equal(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user:preview')).items.length,0);
});
test('partial timeline simulation is deleted first; remaining page items follow automatically',async()=>{
 const h=harness();h.root.document.querySelectorAll=()=>Array.from({length:80},(_,i)=>({querySelector:sel=>sel.includes('time')?{closest:()=>({getAttribute:()=>'/sample_user/status/'+(i+1)})}:null}));
 const set=h.root.localStorage.setItem;h.root.localStorage.setItem=(k,v)=>{set(k,v);if(k.endsWith(':preview')&&JSON.parse(v).items.length===37)h.root.TweetCleaner.stop();};
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
 const scrolls=h.scrolls.length;h.root.localStorage.setItem=set;h.nodes.get('dry').checked=false;
 const fetch=h.root.fetch;h.root.fetch=async(...args)=>{if(h.calls.length<37)assert.equal(h.scrolls.length,scrolls);return fetch(...args);};
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,80);assert.ok(h.scrolls.length>scrolls);
});
test('cached IDs cannot leak from Posts to Replies',async()=>{
 const h=harness();h.root.document.querySelectorAll=()=>[{querySelector:sel=>sel.includes('time')?{closest:()=>({getAttribute:()=>'/sample_user/status/1'})}:null}];
 await h.nodes.get('start').onclick();h.root.location.pathname='/sample_user/with_replies';h.root.document.querySelectorAll=()=>[];h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
});
test('rate-limit response retries same ID before proceeding',async()=>{
 const h=harness([{status:429,body:{errors:[]}},{status:200,body:{data:{delete_tweet:{}}}}]);await h.archive();h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,3);
 assert.equal(JSON.parse(h.calls[0].options.body).variables.tweet_id,JSON.parse(h.calls[1].options.body).variables.tweet_id);
});

test('deletion state is accurate during request; cumulative total updates',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;
 const fetch=h.root.fetch;h.root.fetch=async(...args)=>{assert.equal(h.nodes.get('phase').textContent,'Exclusão em andamento');assert.doesNotMatch(h.nodes.get('status').textContent,/simulação|prévia/i);return fetch(...args);};
 await h.nodes.get('start').onclick();assert.equal(h.nodes.get('deleted').textContent,'2');assert.equal(h.nodes.get('completed').textContent,'2 ações salvas');assert.equal(h.nodes.get('phase').textContent,'Execução concluída');
});

test('minimize keeps a restorable progress control',()=>{
 const h=harness();h.nodes.get('hide').onclick();assert.equal(h.nodes.get('panel').hidden,true);assert.equal(h.nodes.get('mini').hidden,false);
 h.nodes.get('mini').onclick();assert.equal(h.nodes.get('panel').hidden,false);assert.equal(h.nodes.get('mini').hidden,true);
});

test('archive source does not retain stale page pending count',async()=>{
 const h=harness();h.root.document.querySelectorAll=()=>[{querySelector:sel=>sel.includes('time')?{closest:()=>({getAttribute:()=>'/sample_user/status/1'})}:null}];
 await h.nodes.get('start').onclick();assert.equal(h.nodes.get('pending').textContent,'1');h.nodes.get('mode').value='archive';h.nodes.get('mode').onchange();assert.equal(h.nodes.get('pending').textContent,'0');
});

test('rate countdown survives pause and resumes same pending ID',async()=>{
 const h=harness([{status:429,body:{}},{status:200,body:{data:{delete_tweet:{}}}}]);await h.archive(1);h.nodes.get('dry').checked=false;
 const schedule=h.root.setTimeout;let ticks=0;
 h.root.setTimeout=(fn,ms)=>{
  if(h.nodes.get('phase').textContent==='Aguardando o X'&&ticks===0){
   assert.equal(h.nodes.get('countdown').hidden,false);assert.match(h.nodes.get('countdown').textContent,/Retomada automática/);ticks++;h.nodes.get('pause').onclick();assert.equal(h.nodes.get('phase').textContent,'Execução pausada');
  }else if(h.nodes.get('phase').textContent==='Execução pausada'){
   assert.equal(h.calls.length,1);if(++ticks===3){h.nodes.get('pause').onclick();assert.equal(h.nodes.get('phase').textContent,'Aguardando o X');}
  }
  schedule(fn,ms);
 };
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,2);assert.equal(h.nodes.get('countdown').hidden,true);assert.equal(h.nodes.get('phase').textContent,'Execução concluída');
});

test('stop during rate wait does not send another deletion',async()=>{
 const h=harness([{status:429,body:{}}]);await h.archive();h.nodes.get('dry').checked=false;
 const schedule=h.root.setTimeout;h.root.setTimeout=(fn,ms)=>{if(h.nodes.get('phase').textContent==='Aguardando o X')h.root.TweetCleaner.stop();schedule(fn,ms);};
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);assert.equal(h.nodes.get('phase').textContent,'Execução parada');assert.equal(h.nodes.get('pending').textContent,'1');
});

test('canceling confirmation sends no deletion request',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;h.root.prompt=()=>null;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
});

test('bookmarks preview detects saved posts from any author with zero requests',async()=>{
 const h=harness([],new Map(),{pathname:'/i/bookmarks'});
 h.root.document.querySelectorAll=()=>[article('1','sample_user',['removeBookmark']),article('2','other_example',['removeBookmark']),article('3','other_example',['unlike'])];
 assert.equal(h.nodes.get('mode').value,'bookmarks');await h.nodes.get('start').onclick();
 assert.equal(h.calls.length,0);assert.equal(h.nodes.get('scanned').textContent,'2');
 assert.deepEqual(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user:bookmarks:preview')).items,[{id:'1',kind:'bookmark'},{id:'2',kind:'bookmark'}]);
 assert.equal(h.storage.has('tweet-cleaner:v2:sample_user'),false);
});

test('removing bookmarks never deletes the underlying post, even for own posts',async()=>{
 const h=harness([],new Map(),{pathname:'/i/bookmarks',phrase:'REMOVER BOOKMARKS @sample_user'});
 h.root.document.querySelectorAll=()=>[article('1','sample_user',['removeBookmark']),article('2','other_example',['removeBookmark'])];
 h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();
 assert.equal(h.calls.length,2);for(const c of h.calls){assert.match(c.url,/\/DeleteBookmark$/);assert.deepEqual(Object.keys(JSON.parse(c.options.body).variables),['tweet_id']);}
 assert.deepEqual(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user:bookmarks')).done,['bookmark:1','bookmark:2']);
 assert.equal(h.nodes.get('deleted-label').textContent,'Removidos');
});

test('likes require unlike markers and only send UnfavoriteTweet for any author',async()=>{
 const h=harness([],new Map(),{pathname:'/sample_user/likes',phrase:'REMOVER LIKES @sample_user'});
 h.root.document.querySelectorAll=()=>[article('1','sample_user',['unlike']),article('2','other_example',['unlike']),article('3','sample_user',['removeBookmark'])];
 h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();
 assert.equal(h.calls.length,2);for(const c of h.calls)assert.match(c.url,/\/UnfavoriteTweet$/);
 assert.deepEqual(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user:likes')).done,['like:1','like:2']);
 assert.match(h.nodes.get('status').textContent,/posts permanecem/);
});

test('post confirmation phrase does not authorize removing likes',async()=>{
 const h=harness([],new Map(),{pathname:'/sample_user/likes'});
 h.root.document.querySelectorAll=()=>[article('1','sample_user',['unlike'])];h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
 h.root.prompt=()=> 'REMOVER LIKES @sample_user';await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);
});

test('wrong mode and navigation to another account block interaction requests',async()=>{
 const h=harness([],new Map(),{pathname:'/sample_user/likes',phrase:'REMOVER LIKES @sample_user'});
 h.root.document.querySelectorAll=()=>[article('1','sample_user',['unlike'])];h.nodes.get('dry').checked=false;
 h.nodes.get('mode').value='timeline';h.nodes.get('mode').onchange();await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
 h.nodes.get('mode').value='likes';h.nodes.get('mode').onchange();h.root.location.pathname='/other_example/likes';await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
});

test('poisoned bookmark cache containing post deletion is discarded',async()=>{
 const storage=new Map([['tweet-cleaner:v2:sample_user:bookmarks:preview',JSON.stringify({source:'bookmarks:/i/bookmarks',items:[{id:'1',kind:'tweet'}]})]]);
 const h=harness([],storage,{pathname:'/i/bookmarks',phrase:'REMOVER BOOKMARKS @sample_user'});h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);assert.equal(h.nodes.get('pending').textContent,'0');
});

test('mode switching restores separate histories and pending lists',()=>{
 const storage=new Map([
 ['tweet-cleaner:v2:sample_user',JSON.stringify({version:1,done:['tweet:1','retweet:2']})],
 ['tweet-cleaner:v2:sample_user:likes',JSON.stringify({version:1,done:['like:1']})],
 ['tweet-cleaner:v2:sample_user:bookmarks:preview',JSON.stringify({source:'bookmarks:/i/bookmarks',items:[{id:'3',kind:'bookmark'}]})]
 ]);
 const h=harness([],storage);assert.equal(h.nodes.get('completed').textContent,'2 ações salvas');
 h.nodes.get('mode').value='likes';h.nodes.get('mode').onchange();assert.equal(h.nodes.get('source-link').hidden,false);assert.equal(h.nodes.get('source-link').href,'https://x.com/i/history/likes');
 h.root.location.pathname='/sample_user/likes';h.nodes.get('mode').value='likes';h.nodes.get('mode').onchange();assert.equal(h.nodes.get('completed').textContent,'1 ações salvas');
 assert.equal(h.nodes.get('source-link').hidden,true);
 h.root.location.pathname='/i/bookmarks';h.nodes.get('mode').value='bookmarks';h.nodes.get('mode').onchange();assert.equal(h.nodes.get('completed').textContent,'0 ações salvas');assert.equal(h.nodes.get('pending').textContent,'1');
 h.root.location.pathname='/sample_user';h.nodes.get('mode').value='timeline';h.nodes.get('mode').onchange();assert.equal(h.nodes.get('completed').textContent,'2 ações salvas');assert.equal(h.nodes.get('pending').textContent,'0');
});

test('likes preview survives reload and is removed before another scan',async()=>{
 const h=harness([],new Map(),{pathname:'/sample_user/likes'});h.root.document.querySelectorAll=()=>[article('1','other_example',['unlike'])];
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
 const next=harness([],h.storage,{pathname:'/sample_user/likes',phrase:'REMOVER LIKES @sample_user'});next.nodes.get('dry').checked=false;
 const fetch=next.root.fetch;next.root.fetch=async(...args)=>{assert.equal(next.scrolls.length,0);return fetch(...args);};
 await next.nodes.get('start').onclick();assert.equal(next.calls.length,1);assert.match(next.calls[0].url,/\/UnfavoriteTweet$/);
});

test('remarked likes are eligible again; preview never edits completed history',async()=>{
 const key='tweet-cleaner:v2:sample_user:likes',original=JSON.stringify({version:1,done:['like:1']});
 const h=harness([],new Map([[key,original]]),{pathname:'/sample_user/likes',phrase:'REMOVER LIKES @sample_user'});
 h.root.document.querySelectorAll=()=>[article('1','sample_user',['unlike'])];await h.nodes.get('start').onclick();assert.equal(h.storage.get(key),original);
 h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);assert.deepEqual(JSON.parse(h.storage.get(key)).done,['like:1']);
});

test('failed removal of a remarked bookmark remains pending and retryable',async()=>{
 const key='tweet-cleaner:v2:sample_user:bookmarks';
 const h=harness([{status:200,body:{}}],new Map([[key,JSON.stringify({version:1,done:['bookmark:1']})]]),{pathname:'/i/bookmarks',phrase:'REMOVER BOOKMARKS @sample_user'});
 h.root.document.querySelectorAll=()=>[article('1','other_example',['removeBookmark'])];h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);assert.deepEqual(JSON.parse(h.storage.get(key)).done,[]);assert.equal(h.nodes.get('pending').textContent,'1');
 h.root.document.querySelectorAll=()=>[];await h.nodes.get('start').onclick();assert.equal(h.calls.length,2);assert.deepEqual(JSON.parse(h.storage.get(key)).done,['bookmark:1']);
});

test('like rate limit retries only the same unlike action; account lock remains shared',async()=>{
 const h=harness([{status:429,body:{}}],new Map(),{pathname:'/sample_user/likes',phrase:'REMOVER LIKES @sample_user'});
 h.root.document.querySelectorAll=()=>[article('1','other_example',['unlike'])];h.nodes.get('dry').checked=false;
 let lockKey;h.root.navigator.locks.request=async(key,options,fn)=>{lockKey=key;return fn({});};
 await h.nodes.get('start').onclick();assert.equal(lockKey,'tweet-cleaner:v2:sample_user');assert.equal(h.calls.length,2);
 for(const c of h.calls){assert.match(c.url,/\/UnfavoriteTweet$/);assert.equal(JSON.parse(c.options.body).variables.tweet_id,'1');}
});

test('adult-only likes remove only explicit media warnings and preserve other items',async()=>{
 const h=harness([],new Map(),{pathname:'/sample_user/likes',phrase:'REMOVER LIKES ADULTOS @sample_user'});
 h.root.document.querySelectorAll=()=>[
  article('1','sample_user',['unlike'],{label:'Content warning: Adult Content'}),
  article('2','other_example',['unlike'],{label:'Aviso de conteúdo: Conteúdo adulto'}),
  article('3','other_example',['unlike'],{label:'Content warning: Sensitive content'}),
  article('4','other_example',['unlike'],{label:'Content warning: Adult Content',inText:true}),
  article('5','other_example',['unlike'],{label:'Content warning: Adult Content',quoted:true}),
  article('6','other_example',['unlike']),
  article('7','other_example',['unlike'],{label:'Content warning: Adult Content',noShow:true})
 ];
 h.nodes.get('adult').checked=true;h.nodes.get('adult').onchange();h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,2);
 assert.deepEqual(h.calls.map(c=>JSON.parse(c.options.body).variables.tweet_id),['1','2']);
 for(const c of h.calls)assert.match(c.url,/\/UnfavoriteTweet$/);
});

test('adult-only bookmarks preview makes zero requests and records only matching evidence',async()=>{
 const h=harness([],new Map(),{pathname:'/i/bookmarks'});
 h.root.document.querySelectorAll=()=>[article('1','other_example',['removeBookmark'],{label:'Content warning: Adult Content'}),article('2','other_example',['removeBookmark'])];
 h.nodes.get('adult').checked=true;h.nodes.get('adult').onchange();await h.nodes.get('start').onclick();
 assert.equal(h.calls.length,0);assert.deepEqual(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user:bookmarks:preview:adult')).items,[{id:'1',kind:'bookmark',adult:true}]);
});

test('general likes cache cannot enter adult filter; toggling back restores general list',async()=>{
 const h=harness([],new Map(),{pathname:'/sample_user/likes',phrase:'REMOVER LIKES ADULTOS @sample_user'});
 h.root.document.querySelectorAll=()=>[article('1','other_example',['unlike'])];await h.nodes.get('start').onclick();
 assert.equal(h.nodes.get('pending').textContent,'1');h.nodes.get('adult').checked=true;h.nodes.get('adult').onchange();assert.equal(h.nodes.get('pending').textContent,'0');
 h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
 assert.equal(JSON.parse(h.storage.get('tweet-cleaner:v2:sample_user:likes:preview')).items.length,1);
 h.nodes.get('adult').checked=false;h.nodes.get('adult').onchange();assert.equal(h.nodes.get('pending').textContent,'1');
});

test('filtered cache without classification evidence is rejected before requests',async()=>{
 const storage=new Map([['tweet-cleaner:v2:sample_user:likes:preview:adult',JSON.stringify({source:'likes:/sample_user/likes:adult',items:[{id:'1',kind:'like'}]})]]);
 const h=harness([],storage,{pathname:'/sample_user/likes',phrase:'REMOVER LIKES ADULTOS @sample_user'});h.nodes.get('adult').checked=true;h.nodes.get('adult').onchange();h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
});

test('filtered bookmark preview survives reload and only uses bookmark mutation',async()=>{
 const h=harness([],new Map(),{pathname:'/i/bookmarks'});h.root.document.querySelectorAll=()=>[article('1','other_example',['removeBookmark'],{label:'Content warning: Adult Content'})];
 h.nodes.get('adult').checked=true;h.nodes.get('adult').onchange();await h.nodes.get('start').onclick();
 const next=harness([],h.storage,{pathname:'/i/bookmarks',phrase:'REMOVER BOOKMARKS ADULTOS @sample_user'});next.nodes.get('adult').checked=true;next.nodes.get('adult').onchange();next.nodes.get('dry').checked=false;
 await next.nodes.get('start').onclick();assert.equal(next.calls.length,1);assert.match(next.calls[0].url,/\/DeleteBookmark$/);assert.equal(JSON.parse(next.calls[0].options.body).variables.tweet_id,'1');
});

test('adult filter requires specific confirmation and stays locked during a run',async()=>{
 const h=harness([],new Map(),{pathname:'/sample_user/likes',phrase:'REMOVER LIKES @sample_user'});h.root.document.querySelectorAll=()=>[article('1','other_example',['unlike'],{label:'Content warning: Adult Content'})];
 h.nodes.get('adult').checked=true;h.nodes.get('adult').onchange();h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
 h.root.prompt=()=> 'REMOVER LIKES ADULTOS @sample_user';const fetch=h.root.fetch;h.root.fetch=async(...args)=>{assert.equal(h.nodes.get('adult').disabled,true);return fetch(...args);};
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);assert.equal(h.nodes.get('adult').disabled,false);
});

test('History Likes selects Likes automatically and preserves the adult-only filter',async()=>{
 const h=harness([],new Map(),{pathname:'/i/history/likes',phrase:'REMOVER LIKES ADULTOS @sample_user'});
 assert.equal(h.nodes.get('mode').value,'likes');
 h.root.document.querySelectorAll=()=>[article('1','other_example',['unlike'],{label:'Content warning: Adult Content'}),article('2','sample_user',['unlike'])];
 h.nodes.get('adult').checked=true;h.nodes.get('adult').onchange();await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);assert.equal(h.nodes.get('pending').textContent,'1');
 h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);assert.match(h.calls[0].url,/\/UnfavoriteTweet$/);assert.equal(JSON.parse(h.calls[0].options.body).variables.tweet_id,'1');
 h.nodes.get('mode').value='timeline';h.nodes.get('mode').onchange();await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);
});

test('History Likes reuses old filtered preview before scanning and stops on account change',async()=>{
 const storage=new Map([['tweet-cleaner:v2:sample_user:likes:preview:adult',JSON.stringify({source:'likes:/sample_user/likes:adult',items:[{id:'1',kind:'like',adult:true},{id:'2',kind:'like',adult:true}]})]]);
 const h=harness([],storage,{pathname:'/i/history/likes',phrase:'REMOVER LIKES ADULTOS @sample_user'});h.nodes.get('adult').checked=true;h.nodes.get('adult').onchange();assert.equal(h.nodes.get('pending').textContent,'2');h.nodes.get('dry').checked=false;
 const fetch=h.root.fetch;h.root.fetch=async(...args)=>{assert.equal(h.scrolls.length,0);const result=await fetch(...args);h.root.document.querySelector=()=>({getAttribute:()=>'/other_example'});return result;};
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);assert.equal(h.nodes.get('pending').textContent,'1');assert.match(h.nodes.get('status').textContent,/conta ou página mudou/);
 assert.deepEqual(JSON.parse(storage.get('tweet-cleaner:v2:sample_user:likes')).done,['like:1']);
});
