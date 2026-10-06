const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../extension/popup.js'),'utf8');
function popup(url,result={opened:true},saved={}) {
 const nodes=new Map([...fs.readFileSync(path.join(__dirname,'../extension/popup.html'),'utf8').matchAll(/id="([^"]+)"/g)].map(m=>[m[1],{dataset:{},setAttribute(k,v){this[k]=v;}}]));const injections=[],listeners=[];
 const chrome={storage:{local:{get:async()=>({...saved}),set:async values=>{Object.assign(saved,values);for(const listener of listeners)listener(Object.fromEntries(Object.entries(values).map(([k,v])=>[k,{newValue:v}])),'local');}},onChanged:{addListener:fn=>listeners.push(fn)}},runtime:{getManifest:()=>({version:require('../package.json').version})},tabs:{query:async()=>[{id:7,url}]},scripting:{executeScript:async options=>{injections.push(options);return [{result}];}}};
 const document={documentElement:{},getElementById:id=>nodes.get(id)};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../extension/messages.js'),'utf8')+'\n'+source,{chrome,document,URL});return {nodes,injections,saved,listeners,document};
}
test('popup rejects other sites, home, reserved routes and lookalike hosts',async()=>{
 for(const url of ['https://example.com/sample_user','https://x.com/home','https://x.com/settings','https://x.com/i','https://x.com/i/bookmarks/123','https://x.com/i/bookmarks/../../settings','https://x.com.evil.test/sample_user','http://x.com/sample_user','chrome://extensions']){
  const p=popup(url);await p.nodes.get('open').onclick();assert.equal(p.injections.length,0);assert.equal(p.nodes.get('status').dataset.error,'true');assert.equal(p.nodes.get('open').disabled,false);
 }
});
test('popup injects only local bundled engine into the active profile',async()=>{
 for(const suffix of ['','/with_replies','/retweets','/media','/likes']){
  const p=popup('https://x.com/sample_user'+suffix);await p.nodes.get('open').onclick();assert.equal(p.injections.length,2);assert.deepEqual(JSON.parse(JSON.stringify(p.injections[1])),{target:{tabId:7},files:['cleaner.js'],world:'ISOLATED'});assert.deepEqual([...p.injections[0].args],['en']);assert.match(p.nodes.get('status').textContent,/Panel open/);
 }
});
test('popup supports main bookmarks page without expanding permissions',async()=>{
 const p=popup('https://x.com/i/bookmarks');await p.nodes.get('open').onclick();assert.equal(p.injections.length,2);assert.match(p.nodes.get('status').textContent,/Panel open/);
});

test('popup accepts History Likes but rejects other History routes and descendants',async()=>{
 for(const url of ['https://x.com/i/history/likes','https://x.com/i/history/likes/?lang=en']){
  const p=popup(url);await p.nodes.get('open').onclick();assert.equal(p.injections.length,2);assert.match(p.nodes.get('status').textContent,/Panel open/);
 }
 for(const url of ['https://x.com/i/history','https://x.com/i/history/likes/123','https://x.com/i/history/likesevil','https://x.com.evil.test/i/history/likes']){
  const p=popup(url);await p.nodes.get('open').onclick();assert.equal(p.injections.length,0);
 }
});
test('popup reports identity errors instead of falsely claiming panel opened',async()=>{
 const p=popup('https://x.com/sample_user',{error:'Conta diferente.'});await p.nodes.get('open').onclick();assert.equal(p.nodes.get('status').textContent,'Conta diferente.');assert.equal(p.nodes.get('status').dataset.error,'true');
});
test('manifest adds local preference storage without persistent host access',()=>{
 const m=require('../extension/manifest.json');assert.equal(m.manifest_version,3);assert.deepEqual(m.permissions,['activeTab','scripting','storage']);assert.equal(m.host_permissions,undefined);assert.equal(m.content_scripts,undefined);assert.equal(m.version,require('../package.json').version);
});

test('popup defaults to English; toggle saves Portuguese and passes it to the engine',async()=>{
 const p=popup('https://x.com/sample_user');await new Promise(setImmediate);
 assert.equal(p.document.documentElement.lang,'en');assert.equal(p.nodes.get('language').textContent,'PT');assert.equal(p.injections.length,0);
 await p.nodes.get('language').onclick();assert.equal(p.saved['tweet-cleaner:language'],'pt-BR');assert.equal(p.nodes.get('open').textContent,'Abrir painel nesta aba');assert.equal(p.nodes.get('privacy').href,'privacy-pt.html');
 await p.nodes.get('open').onclick();assert.deepEqual([...p.injections[0].args],['pt-BR']);assert.match(p.nodes.get('status').textContent,/Painel aberto/);
 const next=popup('https://x.com/sample_user',{opened:true},p.saved);await new Promise(setImmediate);assert.equal(next.document.documentElement.lang,'pt-BR');assert.equal(next.injections.length,0);
});

test('popup updates the locale and current error when the panel changes the shared preference',async()=>{
 const p=popup('https://example.com');await p.nodes.get('open').onclick();assert.match(p.nodes.get('status').textContent,/Open your profile/);
 p.listeners[0]({'tweet-cleaner:language':{newValue:'pt-BR'}},'local');assert.match(p.nodes.get('status').textContent,/Abra seu perfil/);assert.equal(p.nodes.get('language').textContent,'EN');assert.equal(p.injections.length,0);
});

test('engine error descriptors can be translated after injection fails',async()=>{
 const p=popup('https://x.com/sample_user',{error:'Session expired. Sign in to X again.',errorMessage:{source:'Session expired. Sign in to X again.',values:{}}});
 await p.nodes.get('open').onclick();assert.match(p.nodes.get('status').textContent,/Session expired/);await p.nodes.get('language').onclick();assert.equal(p.nodes.get('status').textContent,'Sessão expirada. Entre novamente no X.');assert.equal(p.nodes.get('status').dataset.error,'true');
});
