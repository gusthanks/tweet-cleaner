const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const translations=require('../locales/pt-BR.json');
const placeholders=text=>[...new Set([...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]))].sort();

test('Portuguese messages preserve every interpolation placeholder',()=>{
 for(const [source,translated] of Object.entries(translations)){
  assert.ok(translated.trim(),source);assert.deepEqual(placeholders(translated),placeholders(source),source);
 }
});

test('console and popup bundle the same translation catalog',()=>{
 const engine=fs.readFileSync(path.join(root,'delete-tweets.js'),'utf8');
 const popup=fs.readFileSync(path.join(root,'extension/messages.js'),'utf8');
 assert.deepEqual(JSON.parse(engine.match(/const PORTUGUESE=(.*);/)[1]),translations);
 assert.deepEqual(JSON.parse(popup.match(/const TweetCleanerPortuguese=(.*);/)[1]),translations);
 for(const declaration of ['STATIC_COPY','phaseNames']){
  const copy=JSON.parse(engine.match(new RegExp('const '+declaration+'=(.*);'))[1]);
  for(const message of Object.values(copy))assert.ok(translations[message],message);
 }
});
