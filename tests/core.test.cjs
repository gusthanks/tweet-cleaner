const {test} = require('node:test');
const assert = require('node:assert/strict');
const core = require('../delete-tweets.js');
test('reject lookalike hosts', () => {
  assert.equal(core.validHost('x.com'), true);
  for (const host of ['evilx.com', 'x.com.evil.test', 'not-twitter.com']) assert.equal(core.validHost(host), false);
});
test('IDs retain precision; duplicates and self replies retained', () => {
  const id = '1620593490609704960';
  const text = 'window.YTD.tweets.part0 = ' + JSON.stringify([{tweet:{id_str:id,in_reply_to_user_id_str:'123'}},{tweet:{id_str:id}}]) + ';';
  assert.deepEqual(core.parseArchive(text), [{id,kind:'tweet'}]);
});
test('retweets and plain tweets both retained', () => {
  assert.equal(core.parseArchive(JSON.stringify([{tweet:{id_str:'1',full_text:'RT @x hi'}},{tweet:{id_str:'2',full_text:'hi'}}])).length, 2);
});
test('archive cannot execute code or accept rounded numeric IDs', () => {
  assert.throws(() => core.parseArchive('window.YTD.tweets.part0 = []; alert(1)'));
  assert.throws(() => core.parseArchive('[{"id_str":1620593490609704960}]'));
  assert.throws(() => core.parseArchive('{}'));
});
test('HTTP 404 is fatal, never treated as absent tweet', () => {
  assert.equal(core.classify(404,{errors:[{code:144,message:'Not found'}]},'tweet'), 'fatal');
});
test('only explicit mutation payload is a success', () => {
  assert.equal(core.classify(200,{},'tweet'),'failed');
  assert.equal(core.classify(200,null,'tweet'),'failed');
  assert.equal(core.classify(200,{data:{delete_tweet:{}}},'tweet'),'ok');
  assert.equal(core.classify(200,{data:{unretweet:{}}},'retweet'),'ok');
  assert.equal(core.classify(200,{data:{delete_tweet:null}},'tweet'),'failed');
});
test('GraphQL errors override payload; absent status is narrowly detected', () => {
  assert.equal(core.classify(200,{errors:[{code:144}]},'tweet'),'gone');
  assert.equal(core.classify(200,{errors:[{code:144},{code:32}]},'tweet'),'failed');
  assert.equal(core.classify(200,{errors:[{message:'already unauthorized'}]},'tweet'),'failed');
});
test('server retry and rate reset longer than 16 minutes', () => {
  assert.equal(core.classify(503,{},'tweet'),'retry');
  assert.equal(core.classify(429,{},'tweet'),'rate');
  assert.equal(core.rateWait('7200',0),7205000);
  assert.equal(core.rateWait(null,0),900000);
});
test('checkpoint rejects corruption and preserves operation types', () => {
  assert.deepEqual([...core.checkpoint('{"version":1,"done":["tweet:1","retweet:1"]}')],['tweet:1','retweet:1']);
  assert.throws(() => core.checkpoint('{"version":1,"done":["secret"]}'));
});
test('permalink extracts only main status paths', () => {
  assert.deepEqual(core.parseLink('/Sample_user/status/1620593490609704960/photo/1'),{author:'sample_user',id:'1620593490609704960'});
  assert.equal(core.parseLink('/search?q=sample_user/status/1'),null);
});

test('interactions use their own mutations and never a post deletion', () => {
  const bookmark=core.mutationFor({id:'1620593490609704960',kind:'bookmark'});
  const like=core.mutationFor({id:'2',kind:'like'});
  assert.equal(bookmark.operation,'DeleteBookmark');assert.equal(like.operation,'UnfavoriteTweet');
  assert.deepEqual(bookmark.variables,{tweet_id:'1620593490609704960'});assert.deepEqual(like.variables,{tweet_id:'2'});
  assert.throws(()=>core.mutationFor({id:'2',kind:'toString'}));assert.throws(()=>core.mutationFor({id:2,kind:'like'}));
});

test('page and action scopes cannot mix posts, likes, and bookmarks', () => {
  assert.equal(core.scopeAllowed('/i/bookmarks','sample_user','bookmarks'),true);
  assert.equal(core.scopeAllowed('/Sample_user/likes/','sample_user','likes'),true);
  assert.equal(core.scopeAllowed('/other/likes','sample_user','likes'),false);
  assert.equal(core.scopeAllowed('/i/bookmarks/123','sample_user','bookmarks'),false);
  for(const mode of ['timeline','archive'])for(const path of ['/sample_user/likes','/i/bookmarks'])assert.equal(core.scopeAllowed(path,'sample_user',mode),false);
  assert.equal(core.itemAllowed({id:'1',kind:'tweet'},'bookmarks'),false);
  assert.equal(core.itemAllowed({id:'1',kind:'like'},'archive'),false);
  assert.equal(core.itemAllowed({id:'1',kind:'bookmark'},'bookmarks'),true);
  assert.equal(core.itemAllowed({id:'1',kind:'like'},'likes'),true);
});

test('interaction success requires an explicit Done for the selected operation', () => {
  for(const [kind,field] of [['bookmark','tweet_bookmark_delete'],['like','unfavorite_tweet']]){
    assert.equal(core.classify(200,{data:{[field]:'Done'}},kind),'ok');
    for(const value of [null,{},true,''])assert.equal(core.classify(200,{data:{[field]:value}},kind),'failed');
    assert.equal(core.classify(200,{data:{delete_tweet:{}}},kind),'failed');
    assert.equal(core.classify(200,{data:{[field]:'Done'},errors:[{code:32}]},kind),'failed');
  }
});

test('checkpoint preserves all four operation kinds without changing old IDs', () => {
  const ids=['tweet:1','retweet:1','bookmark:1','like:1'];
  assert.deepEqual([...core.checkpoint(JSON.stringify({version:1,done:ids}))],ids);
});

test('adult filter accepts only explicit English and Portuguese adult warning titles', () => {
  for(const label of ['Content warning: Adult Content','Aviso de conteúdo: Conteúdo adulto',' Aviso de conteu\u0301do: Conteu\u0301do adulto. '])assert.equal(core.adultWarningLabel(label),true);
  for(const label of ['Content warning: Sensitive content','Content warning: Violence','Content warning: Nudity','Conteúdo sensível','adult content','NSFW','18+','Eu disse Content warning: Adult Content'])assert.equal(core.adultWarningLabel(label),false);
});

test('adult warning must belong to media UI with Show control, never text or quotes', () => {
  function fixture({excluded=false,show=true,containsText=false}={}){
    const article={querySelectorAll:()=>[node]};
    const container={parentElement:article,querySelector:()=>containsText?{}:null,querySelectorAll:()=>show?[{textContent:'Show'}]:[]};
    const node={textContent:'Content warning: Adult Content',parentElement:container,closest:()=>excluded?{}:null};return article;
  }
  assert.equal(core.hasAdultWarning(fixture()),true);
  assert.equal(core.hasAdultWarning(fixture({excluded:true})),false);
  assert.equal(core.hasAdultWarning(fixture({show:false})),false);
  assert.equal(core.hasAdultWarning(fixture({containsText:true})),false);
});

test('filtered interaction requires recorded adult evidence and cannot target posts', () => {
  assert.equal(core.itemMatchesFilter({id:'1',kind:'like',adult:true},'likes',true),true);
  for(const adult of [false,undefined,'true',1])assert.equal(core.itemMatchesFilter({id:'1',kind:'bookmark',adult},'bookmarks',true),false);
  assert.equal(core.itemMatchesFilter({id:'1',kind:'tweet',adult:true},'timeline',true),false);
  assert.equal(core.itemMatchesFilter({id:'1',kind:'like'},'likes',false),true);
});

test('History Likes belongs to the connected account and cannot authorize other modes', () => {
  for(const path of ['/i/history/likes','/i/history/likes/']){
    assert.equal(core.scopeAllowed(path,'sample_user','likes'),true);
    for(const mode of ['timeline','archive','bookmarks'])assert.equal(core.scopeAllowed(path,'sample_user',mode),false);
  }
  for(const path of ['/i/history','/i/history/likes/123','/i/history/likesevil','/other/likes'])assert.equal(core.scopeAllowed(path,'sample_user','likes'),false);
  assert.equal(core.scopeAllowed('/i/history/likes','','likes'),false);
});

test('Likes aliases retain existing previews without crossing account or filter boundaries', () => {
  for(const path of ['/sample_user/likes','/sample_user/likes/','/i/history/likes','/i/history/likes/']){
    assert.equal(core.normalizeSource('likes:'+path,'sample_user'),'likes:/i/history/likes');
    assert.equal(core.normalizeSource('likes:'+path+':adult','sample_user'),'likes:/i/history/likes:adult');
  }
  for(const source of ['likes:/other/likes','likes:/sample_user/likes/123','timeline:/sample_user/with_replies','bookmarks:/i/bookmarks'])assert.equal(core.normalizeSource(source,'sample_user'),source);
});
