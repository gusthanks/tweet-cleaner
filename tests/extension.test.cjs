const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../extension/popup.js'),'utf8');
function popup(url,result={opened:true}) {
 const nodes=new Map(['open','status','version'].map(id=>[id,{dataset:{}}]));const injections=[];
 const chrome={runtime:{getManifest:()=>({version:require('../package.json').version})},tabs:{query:async()=>[{id:7,url}]},scripting:{executeScript:async options=>{injections.push(options);return [{result}];}}};
 vm.runInNewContext(source,{chrome,document:{getElementById:id=>nodes.get(id)},URL});return {nodes,injections};
}
test('popup rejects other sites, home, reserved routes and lookalike hosts',async()=>{
 for(const url of ['https://example.com/sample_user','https://x.com/home','https://x.com/settings','https://x.com/i','https://x.com/i/bookmarks/123','https://x.com/i/bookmarks/../../settings','https://x.com.evil.test/sample_user','http://x.com/sample_user','chrome://extensions']){
  const p=popup(url);await p.nodes.get('open').onclick();assert.equal(p.injections.length,0);assert.equal(p.nodes.get('status').dataset.error,'true');assert.equal(p.nodes.get('open').disabled,false);
 }
});
test('popup injects only local bundled engine into the active profile',async()=>{
 for(const suffix of ['','/with_replies','/retweets','/media','/likes']){
  const p=popup('https://x.com/sample_user'+suffix);await p.nodes.get('open').onclick();assert.equal(p.injections.length,1);assert.deepEqual(JSON.parse(JSON.stringify(p.injections[0])),{target:{tabId:7},files:['cleaner.js'],world:'ISOLATED'});assert.match(p.nodes.get('status').textContent,/Painel aberto/);
 }
});
test('popup supports main bookmarks page without expanding permissions',async()=>{
 const p=popup('https://x.com/i/bookmarks');await p.nodes.get('open').onclick();assert.equal(p.injections.length,1);assert.match(p.nodes.get('status').textContent,/Painel aberto/);
});

test('popup accepts History Likes but rejects other History routes and descendants',async()=>{
 for(const url of ['https://x.com/i/history/likes','https://x.com/i/history/likes/?lang=en']){
  const p=popup(url);await p.nodes.get('open').onclick();assert.equal(p.injections.length,1);assert.match(p.nodes.get('status').textContent,/Painel aberto/);
 }
 for(const url of ['https://x.com/i/history','https://x.com/i/history/likes/123','https://x.com/i/history/likesevil','https://x.com.evil.test/i/history/likes']){
  const p=popup(url);await p.nodes.get('open').onclick();assert.equal(p.injections.length,0);
 }
});
test('popup reports identity errors instead of falsely claiming panel opened',async()=>{
 const p=popup('https://x.com/sample_user',{error:'Conta diferente.'});await p.nodes.get('open').onclick();assert.equal(p.nodes.get('status').textContent,'Conta diferente.');assert.equal(p.nodes.get('status').dataset.error,'true');
});
test('manifest asks only for temporary tab access and bundled injection',()=>{
 const m=require('../extension/manifest.json');assert.equal(m.manifest_version,3);assert.deepEqual(m.permissions,['activeTab','scripting']);assert.equal(m.host_permissions,undefined);assert.equal(m.content_scripts,undefined);assert.equal(m.version,require('../package.json').version);
});
