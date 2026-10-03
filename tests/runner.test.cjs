const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require.resolve('../delete-tweets.js'),'utf8');
function harness(responses=[],storage=new Map()) {
 const nodes=new Map(),calls=[],scrolls=[];let clock=0;
 const shadow={set innerHTML(html){for(const [,id] of html.matchAll(/id="([^"]+)"/g))nodes.set(id,{checked:id==='dry',value:id==='mode'?'timeline':'',style:{}});},getElementById:id=>nodes.get(id)};
 const doc={cookie:'ct0=TEST_ONLY',body:{appendChild(){}},documentElement:{scrollHeight:600},querySelectorAll:()=>[],createElement:()=>({style:{},attachShadow:()=>shadow}),querySelector:()=>({getAttribute:()=>'/gusthanks'})};
 const root={document:doc,location:{hostname:'x.com',pathname:'/gusthanks'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},navigator:{locks:{request:async(k,o,fn)=>fn({})}},prompt:()=> 'EXCLUIR @gusthanks',alert:()=>{},setTimeout:(fn,ms)=>{clock+=ms;setImmediate(fn);},fetch:async(url,options)=>{calls.push({url,options});const r=responses.shift()||{status:200,body:{data:{delete_tweet:{}}}};return {status:r.status,json:async()=>r.body,headers:{get:()=>null}};}};
 class FakeDate extends Date {static now(){return clock;}}
 root.scrollY=0;root.innerHeight=600;root.scrollTo=(...args)=>scrolls.push(args);root.scrollBy=(...args)=>scrolls.push(args);
 vm.runInNewContext(source,{window:root,Date:FakeDate,AbortSignal,URL,Blob,console});
 return {nodes,calls,storage,root,scrolls,async archive(count=2){nodes.get('mode').value='archive';nodes.get('files').files=[{text:async()=>JSON.stringify(Array.from({length:count},(_,i)=>({tweet:{id_str:String(i+1)}})))}];await nodes.get('files').onchange();}};
}
test('simulation sends zero requests and stores no completed IDs',async()=>{
 const h=harness();await h.archive();await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);assert.equal(h.storage.has('tweet-cleaner:v2:gusthanks'),false);
});
test('successful IDs persist and rerun skips them',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();assert.equal(h.calls.length,2);
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,2);
 assert.deepEqual(JSON.parse(h.storage.get('tweet-cleaner:v2:gusthanks')).done,['tweet:1','tweet:2']);
 for(const c of h.calls){assert.ok(c.url.startsWith('https://x.com/'));assert.equal(c.options.credentials,'include');}
});
test('auth failure stops queue without checkpointing failed ID',async()=>{
 const h=harness([{status:403,body:{errors:[{message:'Forbidden'}]}}]);await h.archive();h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);assert.equal(h.storage.has('tweet-cleaner:v2:gusthanks'),false);assert.match(h.nodes.get('status').textContent,/HTTP 403/);
});
test('ambiguous HTTP success never saved; failed IDs retried next run',async()=>{
 const h=harness([{status:200,body:{}},{status:200,body:{data:{delete_tweet:{}}}}]);await h.archive();h.nodes.get('dry').checked=false;await h.nodes.get('start').onclick();assert.deepEqual(JSON.parse(h.storage.get('tweet-cleaner:v2:gusthanks')).done,['tweet:2']);await h.nodes.get('start').onclick();assert.equal(h.calls.length,3);
});
test('account navigation blocks subsequent requests',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;h.root.location.pathname='/someoneelse';await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
});
test('stop finishes only the in-flight request',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;
 const fetch=h.root.fetch;h.root.fetch=async(...args)=>{const result=await fetch(...args);h.root.TweetCleaner.stop();return result;};
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,1);
 assert.deepEqual(JSON.parse(h.storage.get('tweet-cleaner:v2:gusthanks')).done,['tweet:1']);
});
test('concurrent run cannot acquire lock and sends zero requests',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;h.root.navigator.locks.request=async(k,o,fn)=>fn(null);
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);assert.match(h.nodes.get('status').textContent,/outra aba/);
});
test('storage failure aborts instead of silently losing checkpoint',async()=>{
 const h=harness();await h.archive();h.nodes.get('dry').checked=false;h.root.localStorage.setItem=()=>{throw Error('quota exceeded');};
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);assert.match(h.nodes.get('status').textContent,/quota exceeded/);
});
test('simulation collects max 500; deletion reuses cache after reload without scrolling',async()=>{
 const h=harness();await h.archive(505);await h.nodes.get('start').onclick();
 assert.equal(h.calls.length,0);assert.equal(JSON.parse(h.storage.get('tweet-cleaner:v2:gusthanks:preview')).items.length,500);
 const next=harness([],h.storage);next.nodes.get('mode').value='archive';next.nodes.get('dry').checked=false;
 await next.nodes.get('start').onclick();assert.equal(next.calls.length,500);assert.equal(next.scrolls.length,0);
 assert.equal(JSON.parse(next.storage.get('tweet-cleaner:v2:gusthanks')).done.length,500);
 assert.match(next.nodes.get('status').textContent,/Limite de 500/);
});
test('next manual archive run deletes remaining items only',async()=>{
 const h=harness();await h.archive(505);h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,500);
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,505);
});
test('retries also count toward max 500 requests',async()=>{
 const responses=Array.from({length:499},()=>({status:200,body:{data:{delete_tweet:{}}}}));responses.push({status:503,body:{}});
 const h=harness(responses);await h.archive(505);h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,500);
 assert.equal(JSON.parse(h.storage.get('tweet-cleaner:v2:gusthanks')).done.length,499);
 assert.equal(JSON.parse(h.storage.get('tweet-cleaner:v2:gusthanks:preview')).items.length,1);
});
test('partial timeline simulation saves IDs; delete uses them without another scroll',async()=>{
 const h=harness();h.root.document.querySelectorAll=()=>Array.from({length:80},(_,i)=>({querySelector:sel=>sel.includes('time')?{closest:()=>({getAttribute:()=>'/gusthanks/status/'+(i+1)})}:null}));
 const set=h.root.localStorage.setItem;h.root.localStorage.setItem=(k,v)=>{set(k,v);if(k.endsWith(':preview')&&JSON.parse(v).items.length===37)h.root.TweetCleaner.stop();};
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
 const scrolls=h.scrolls.length;h.root.localStorage.setItem=set;h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,37);assert.equal(h.scrolls.length,scrolls);
});
test('cached IDs cannot leak from Posts to Replies',async()=>{
 const h=harness();h.root.document.querySelectorAll=()=>[{querySelector:sel=>sel.includes('time')?{closest:()=>({getAttribute:()=>'/gusthanks/status/1'})}:null}];
 await h.nodes.get('start').onclick();h.root.location.pathname='/gusthanks/with_replies';h.root.document.querySelectorAll=()=>[];h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,0);
});
test('rate-limit response retries same ID before proceeding',async()=>{
 const h=harness([{status:429,body:{errors:[]}},{status:200,body:{data:{delete_tweet:{}}}}]);await h.archive();h.nodes.get('dry').checked=false;
 await h.nodes.get('start').onclick();assert.equal(h.calls.length,3);
 assert.equal(JSON.parse(h.calls[0].options.body).variables.tweet_id,JSON.parse(h.calls[1].options.body).variables.tweet_id);
});
