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
  assert.deepEqual(core.parseLink('/Gusthanks/status/1620593490609704960/photo/1'),{author:'gusthanks',id:'1620593490609704960'});
  assert.equal(core.parseLink('/search?q=gusthanks/status/1'),null);
});
