/* MIT; derived from backzso/tweetdelete (c) 2026 backzso. */
(function(root){
'use strict';
const VERSION='2.0.0';
const QUERY={tweet:'VaenaVgh5q5ih7kvyVjgtg',retweet:'iQtK4dl5hBmXewYZuEOKVw'};
const BEARER='AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
function validHost(host){return ['x.com','www.x.com','twitter.com','www.twitter.com'].includes(host);}
function parseLink(href){const m=/^\/([A-Za-z0-9_]+)\/status\/(\d+)(?:[/?#]|$)/.exec(href||'');return m?{author:m[1].toLowerCase(),id:m[2]}:null;}
function parseArchive(text){
 const json=text.trim().replace(/^window\.YTD\.(?:tweets?|tweet_headers)\.part\d+\s*=\s*/,'').replace(/;\s*$/,'');
 const entries=JSON.parse(json); if(!Array.isArray(entries))throw Error('Use um arquivo tweets.js ou tweets-part*.js.');
 const unique=new Map();
 for(const entry of entries){const t=entry.tweet||entry;if(typeof t.id_str!=='string'||!/^\d+$/.test(t.id_str))throw Error('ID inválido no arquivo.');unique.set(t.id_str,{id:t.id_str,kind:'tweet'});}
 return [...unique.values()];
}
function classify(status,body,kind){
 if(status===429)return 'rate';if([401,403,404].includes(status))return 'fatal';if(status>=500||status===408)return 'retry';
 if(status<200||status>=300||!body||typeof body!=='object')return 'failed';
 if(body.errors?.length)return body.errors.every(e=>Number(e.code)===144)?'gone':'failed';
 const key=kind==='retweet'?'unretweet':'delete_tweet';
 return body.data&&Object.prototype.hasOwnProperty.call(body.data,key)&&body.data[key]!==null?'ok':'failed';
}
function rateWait(reset,now){const n=Number(reset);return Number.isFinite(n)&&n*1000>now?n*1000-now+5000:900000;}
function checkpoint(raw){if(!raw)return new Set();const v=JSON.parse(raw);if(v.version!==1||!Array.isArray(v.done)||v.done.some(x=>!/^(tweet|retweet):\d+$/.test(x)))throw Error('Progresso salvo inválido; exporte antes de limpar o armazenamento.');return new Set(v.done);}
const core={validHost,parseLink,parseArchive,classify,rateWait,checkpoint};
if(typeof module!=='undefined'&&module.exports){module.exports=core;return;}
const doc=root.document;
if(!validHost(root.location.hostname)){root.alert('Abra seu perfil em x.com.');return;}
if(root.TweetCleaner){root.TweetCleaner.show();return;}
function identity(){
 const href=doc.querySelector('a[data-testid="AppTabBar_Profile_Link"]')?.getAttribute('href');
 const handle=/^\/([A-Za-z0-9_]+)$/.exec(href||'')?.[1]?.toLowerCase();const p=root.location.pathname.split('/');
 if(!handle||p[1]?.toLowerCase()!==handle||!['',undefined,'with_replies','retweets','reposts','media'].includes(p[2]))throw Error('Abra o perfil da conta conectada. A identidade precisa estar visível.');return handle;
}
let account,done;
try{account=identity();done=checkpoint(root.localStorage.getItem('tweet-cleaner:v2:'+account));}catch(e){root.alert(e.message);return;}
const key='tweet-cleaner:v2:'+account;
let queue=[],busy=false,paused=false,stopped=false,dry=true;
const stats={deleted:0,gone:0,failed:0,skipped:0,scanned:0},failures=new Map(),attempted=new Set();
const host=doc.createElement('div');host.style.cssText='position:fixed;right:12px;bottom:12px;z-index:2147483647;max-width:calc(100vw - 24px)';
const shadow=host.attachShadow({mode:'open'});
shadow.innerHTML=`<style>:host{font:14px system-ui}section{background:#15202b;color:#fff;border:1px solid #536471;border-radius:14px;padding:16px;width:330px;max-width:calc(100vw - 60px);box-shadow:0 6px 24px #0008}h2{margin:0 0 8px;font-size:18px}button,select,input{margin:4px 3px 4px 0}button{padding:7px;border:0;border-radius:6px;cursor:pointer}button:disabled{opacity:.5}p{line-height:1.4}pre{white-space:pre-wrap;font:12px system-ui;max-height:100px;overflow:auto}</style>
<section><h2>Tweet Cleaner ${VERSION}</h2><p id="account"></p>
<select id="mode"><option value="timeline">Página atual (sem arquivo)</option><option value="archive">Arquivo local (histórico)</option></select>
<input id="files" type="file" accept=".js,.json" multiple hidden><label><input id="dry" type="checkbox" checked>Simular primeiro</label>
<p>Exclusão permanente. A página pode omitir posts antigos. Execute também nas abas Respostas e Reposts.</p>
<button id="start">Iniciar</button><button id="pause" disabled>Pausar</button><button id="stop" disabled>Parar</button><button id="report">Exportar relatório</button><button id="hide">Ocultar</button>
<p id="stats"></p><pre id="status">Pronto. A simulação não apaga nada.</pre></section>`;
doc.body.appendChild(host);const el=id=>shadow.getElementById(id);el('account').textContent='@'+account+' · '+done.size+' ações concluídas salvas';
function update(message){el('stats').textContent=`Excluídos: ${stats.deleted} · já ausentes: ${stats.gone} · falhas: ${stats.failed}\nEncontrados: ${stats.scanned} · retomada: ${stats.skipped}`;if(message)el('status').textContent=message;}
async function wait(ms){const end=Date.now()+ms;while(!stopped&&(Date.now()<end||paused))await new Promise(r=>root.setTimeout(r,250));}
function assertAccount(){if(identity()!==account)throw Error('A conta ou página mudou. Execução interrompida.');}
function save(item){done.add(item.kind+':'+item.id);root.localStorage.setItem(key,JSON.stringify({version:1,done:[...done]}));}
async function remove(item){
 for(let attempt=0;attempt<4&&!stopped;attempt++){
  await wait(0);if(stopped)return 'stopped';assertAccount();
  const csrf=doc.cookie.match(/(?:^|;\s*)ct0=([^;]+)/)?.[1];if(!csrf)throw Error('Sessão expirada. Entre novamente no X.');
  const op=item.kind==='retweet'?'DeleteRetweet':'DeleteTweet',queryId=QUERY[item.kind];
  const variables=item.kind==='retweet'?{source_tweet_id:item.id,dark_request:false}:{tweet_id:item.id,dark_request:false};
  let response;
  try{response=await root.fetch('https://x.com/i/api/graphql/'+queryId+'/'+op,{method:'POST',credentials:'include',signal:AbortSignal.timeout(30000),headers:{authorization:'Bearer '+BEARER,'x-csrf-token':csrf,'content-type':'application/json','x-twitter-auth-type':'OAuth2Session','x-twitter-active-user':'yes'},body:JSON.stringify({queryId,variables})});}
  catch(e){if(attempt===3)return 'failed';update('Falha de rede. Tentando novamente…');await wait(2000*2**attempt);continue;}
  const body=await response.json().catch(()=>null),result=classify(response.status,body,item.kind);
  if(result==='rate'){const ms=rateWait(response.headers.get('x-rate-limit-reset'),Date.now());update('Limite do X. Retomada após '+new Date(Date.now()+ms).toLocaleTimeString());await wait(ms);attempt--;continue;}
  if(result==='fatal')throw Error(`X respondeu HTTP ${response.status}. Sessão ou API incompatível; nenhuma conclusão de sucesso foi registrada.`);
  if(result==='retry'&&attempt<3){await wait(2000*2**attempt);continue;}
  return result==='retry'?'failed':result;
 }
 return 'stopped';
}
function visibleItems(){
 const items=new Map();for(const article of doc.querySelectorAll('article[data-testid="tweet"]')){
  const time=article.querySelector('a[href*="/status/"] time'),t=parseLink(time?.closest('a')?.getAttribute('href'));if(!t)continue;
  const kind=t.author===account?'tweet':article.querySelector('[data-testid="unretweet"]')?'retweet':null;
  if(kind)items.set(kind+':'+t.id,{id:t.id,kind});
 }return [...items.values()];
}
async function process(items){
 for(const item of items){if(stopped)break;await wait(0);if(stopped)break;assertAccount();const id=item.kind+':'+item.id;if(attempted.has(id))continue;attempted.add(id);stats.scanned++;
  if(done.has(id)){stats.skipped++;update();continue;}if(dry){update('Simulação: IDs encontrados; nenhuma exclusão enviada.');continue;}
  const result=await remove(item);if(result==='ok'||result==='gone'){save(item);result==='ok'?stats.deleted++:stats.gone++;failures.delete(id);}else if(result!=='stopped'){stats.failed++;failures.set(id,result);}
  update();await wait(800);
 }
}
async function run(){
 if(el('mode').value==='archive'){if(!queue.length)throw Error('Selecione arquivos tweets.js/tweets-part*.js.');await process(queue);}
 else{root.scrollTo(0,0);await wait(700);let idle=0,passes=0;
  while(!stopped&&idle<12){assertAccount();const before=attempted.size;await process(visibleItems());const bottom=root.scrollY+root.innerHeight>=doc.documentElement.scrollHeight-100;idle=bottom&&attempted.size===before?idle+1:0;root.scrollBy(0,Math.round(root.innerHeight*.65));await wait(1500);if(++passes>20000)throw Error('Limite de varredura atingido. Exporte o relatório e reinicie.');}
 }
 update(stopped?'Parado. Uma requisição já enviada pode terminar; IDs concluídos ficam salvos.':dry?'Simulação concluída. Desmarque Simular primeiro para excluir.':`Rodada concluída com ${stats.failed} falhas. Confira o relatório e atualize a página. Isso não comprova que todo o histórico foi removido.`);
}
el('mode').onchange=()=>{el('files').hidden=el('mode').value!=='archive';};
el('files').onchange=async()=>{queue=[];try{const combined=new Map();for(const file of el('files').files)for(const item of parseArchive(await file.text()))combined.set(item.id,item);queue=[...combined.values()];update(queue.length+' IDs únicos carregados localmente.');}catch(e){update(e.message);}};
el('start').onclick=async()=>{
 if(busy)return;dry=el('dry').checked;try{assertAccount();}catch(e){update(e.message);return;}
 if(el('mode').value==='archive'&&!queue.length){update('Selecione os arquivos primeiro.');return;}
 if(!dry&&root.prompt(`Excluir permanentemente tweets/respostas e desfazer reposts de @${account}? Digite EXCLUIR @${account} para iniciar.`)!=='EXCLUIR @'+account)return;
 if(!root.navigator.locks){update('Use Chrome atualizado: este navegador não oferece trava de execução.');return;}
 await root.navigator.locks.request(key,{ifAvailable:true},async lock=>{
  if(!lock){update('Já existe uma execução nesta conta em outra aba.');return;}
  try{done=checkpoint(root.localStorage.getItem(key));}catch(e){update(e.message);return;}
  busy=true;stopped=false;paused=false;attempted.clear();Object.keys(stats).forEach(k=>stats[k]=0);failures.clear();
  ['start','mode','files','dry'].forEach(id=>el(id).disabled=true);el('pause').disabled=el('stop').disabled=false;el('pause').textContent='Pausar';
  try{await run();}catch(e){update('Interrompido: '+e.message);}finally{busy=false;['start','mode','files','dry'].forEach(id=>el(id).disabled=false);el('pause').disabled=el('stop').disabled=true;}
 });
};
el('pause').onclick=()=>{paused=!paused;el('pause').textContent=paused?'Retomar':'Pausar';update(paused?'Pausado após a requisição atual.':'Retomando…');};
el('stop').onclick=()=>{stopped=true;paused=false;update('Parando após a requisição atual…');};
el('hide').onclick=()=>{host.style.display='none';};
el('report').onclick=()=>{const report={version:VERSION,account,date:new Date().toISOString(),mode:el('mode').value,simulation:dry,stats,completed:[...done],failures:[...failures]};const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=doc.createElement('a');a.href=url;a.download='tweet-cleaner-report.json';a.click();root.setTimeout(()=>URL.revokeObjectURL(url),1000);};
root.TweetCleaner={show:()=>{host.style.display='';},stop:()=>{stopped=true;paused=false;}};update();
})(typeof window==='undefined'?{}:window);
