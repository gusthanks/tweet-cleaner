// ==UserScript==
// @name         Tweet Cleaner
// @namespace    urn:tweet-cleaner
// @version      3.1.0
// @description  Limpeza com prévia, retomada e confirmação explícita.
// @match        https://x.com/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// ==/UserScript==
GM_registerMenuCommand('Abrir Tweet Cleaner', () => {
/* MIT; derived from backzso/tweetdelete (c) 2026 backzso. */
(function(root){
'use strict';
const VERSION='3.1.0';
const MUTATIONS={
 tweet:{queryId:'VaenaVgh5q5ih7kvyVjgtg',operation:'DeleteTweet',result:'delete_tweet'},
 retweet:{queryId:'iQtK4dl5hBmXewYZuEOKVw',operation:'DeleteRetweet',result:'unretweet'},
 bookmark:{queryId:'Wlmlj2-xzyS1GN3a6cj-mQ',operation:'DeleteBookmark',result:'tweet_bookmark_delete'},
 like:{queryId:'ZYKSe-w7KEslx3JhSIk5LA',operation:'UnfavoriteTweet',result:'unfavorite_tweet'}
};
const MODES={timeline:['tweet','retweet'],archive:['tweet'],bookmarks:['bookmark'],likes:['like']};
const BEARER='AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
function validHost(host){return ['x.com','www.x.com','twitter.com','www.twitter.com'].includes(host);}
function parseLink(href){const m=/^\/([A-Za-z0-9_]+)\/status\/(\d+)(?:[/?#]|$)/.exec(href||'');return m?{author:m[1].toLowerCase(),id:m[2]}:null;}
function itemAllowed(item,mode){return typeof item?.id==='string'&&/^\d+$/.test(item.id)&&Boolean(MODES[mode]?.includes(item.kind));}
function itemMatchesFilter(item,mode,adultOnly){return itemAllowed(item,mode)&&(!adultOnly||(['likes','bookmarks'].includes(mode)&&item.adult===true));}
function normalized(text){return String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase();}
function adultWarningLabel(text){return /^(?:content warning:\s*adult content|aviso de conteudo:\s*conteudo adulto)[.!]?$/.test(normalized(text));}
function hasAdultWarning(article){
 // Only a media warning with a Show control qualifies. Post text, quotes,
 // cards, alt text, account names and generic sensitive notices never qualify.
 for(const node of article.querySelectorAll?.('div,span')||[]){
  if(!adultWarningLabel(node.textContent)||node.closest?.('[data-testid="tweetText"],[data-testid="card.wrapper"],[data-testid="quoteTweet"],[role="link"],a'))continue;
  let container=node.parentElement;
  for(let depth=0;container&&container!==article&&depth<6;depth++,container=container.parentElement){
   if(container.querySelector('[data-testid="tweetText"]'))break;
   if([...container.querySelectorAll('button,[role="button"]')].some(button=>['show','mostrar','exibir'].includes(normalized(button.textContent))))return true;
  }
 }
 return false;
}
function scopeAllowed(path,account,mode){
 if(!/^[a-z0-9_]+$/.test(account||''))return false;
 if(mode==='bookmarks')return /^\/i\/bookmarks\/?$/.test(path);
 if(mode==='likes')return path.toLowerCase().replace(/\/$/,'')==='/'+account+'/likes';
 return ['timeline','archive'].includes(mode)&&new RegExp('^/'+account+'(?:/(?:with_replies|retweets|reposts|media))?/?$','i').test(path);
}
function mutationFor(item){
 if(typeof item?.id!=='string'||!/^\d+$/.test(item.id)||!Object.prototype.hasOwnProperty.call(MUTATIONS,item.kind))throw Error('Operação ou ID inválido.');
 const spec=MUTATIONS[item.kind];const variables=item.kind==='retweet'?{source_tweet_id:item.id,dark_request:false}:item.kind==='tweet'?{tweet_id:item.id,dark_request:false}:{tweet_id:item.id};
 return {operation:spec.operation,queryId:spec.queryId,variables};
}
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
 const key=MUTATIONS[kind]?.result;if(!key)return 'failed';
 if(['bookmark','like'].includes(kind))return body.data?.[key]==='Done'?'ok':'failed';
 return body.data&&Object.prototype.hasOwnProperty.call(body.data,key)&&body.data[key]!==null?'ok':'failed';
}
function rateWait(reset,now){const n=Number(reset);return Number.isFinite(n)&&n*1000>now?n*1000-now+5000:900000;}
function checkpoint(raw){if(!raw)return new Set();const v=JSON.parse(raw);if(v.version!==1||!Array.isArray(v.done)||v.done.some(x=>!/^(tweet|retweet|bookmark|like):\d+$/.test(x)))throw Error('Progresso salvo inválido; exporte antes de limpar o armazenamento.');return new Set(v.done);}
const core={validHost,parseLink,parseArchive,classify,rateWait,checkpoint,itemAllowed,itemMatchesFilter,adultWarningLabel,hasAdultWarning,scopeAllowed,mutationFor};
if(typeof module!=='undefined'&&module.exports){module.exports=core;return;}
const doc=root.document;
if(!validHost(root.location.hostname)){root.alert('Abra seu perfil em x.com.');return {error:'Abra seu perfil em x.com.'};}
if(root.TweetCleaner){root.TweetCleaner.show();return root.TweetCleaner.version===VERSION?{opened:true,version:VERSION}:{error:'Pare a versão antiga e recarregue a aba do X para abrir a nova versão.'};}
function identity(){
 const href=doc.querySelector('a[data-testid="AppTabBar_Profile_Link"]')?.getAttribute('href');
 const handle=/^\/([A-Za-z0-9_]+)$/.exec(href||'')?.[1]?.toLowerCase();
 if(!handle||!['timeline','bookmarks','likes'].some(mode=>scopeAllowed(root.location.pathname,handle,mode)))throw Error('Abra o próprio perfil, Likes ou Bookmarks no X. A conta conectada precisa estar visível.');return handle;
}
let account,done,initialMode;
try{account=identity();initialMode=scopeAllowed(root.location.pathname,account,'bookmarks')?'bookmarks':scopeAllowed(root.location.pathname,account,'likes')?'likes':'timeline';}catch(e){root.alert(e.message);return {error:e.message};}
const key='tweet-cleaner:v2:'+account;
const progressKey=()=>key+(['bookmarks','likes'].includes(el('mode').value)?':'+el('mode').value:'');
const interactions=()=>['bookmarks','likes'].includes(el('mode').value);
const adultOnly=()=>interactions()&&el('adult').checked;
const sourceKey=()=>el('mode').value+':'+root.location.pathname+(adultOnly()?':adult':'');
const previewKey=()=>progressKey()+':preview'+(adultOnly()?':adult':'');
const noun=()=>el('mode').value==='bookmarks'?'bookmarks':el('mode').value==='likes'?'likes':'posts';
const targetNoun=()=>noun()+(adultOnly()?' de conteúdo adulto':'');
const activeMessage=()=>interactions()?'Removendo '+targetNoun()+'. Os posts permanecem no X.':'Excluindo os posts disponíveis. O progresso é salvo a cada sucesso.';
let queue=[],busy=false,paused=false,stopped=false,dry=true;
let previewSource='',preview=new Map();
function loadProgress(){
 done=checkpoint(root.localStorage.getItem(progressKey()));previewSource='';preview=new Map();
 try{const saved=JSON.parse(root.localStorage.getItem(previewKey())||'null');
  if(saved&&typeof saved.source==='string'&&Array.isArray(saved.items)&&saved.items.every(t=>itemMatchesFilter(t,el('mode').value,adultOnly()))){previewSource=saved.source;preview=new Map(saved.items.map(t=>[t.kind+':'+t.id,t]));}
 }catch(e){ /* Invalid pending cache is discarded, never used for removal. */ }
}
const stats={deleted:0,gone:0,failed:0,skipped:0,scanned:0,requests:0},failures=new Map(),attempted=new Set();
const host=doc.createElement('div');host.id='tweet-cleaner-panel';host.style.cssText='position:fixed;right:16px;bottom:16px;z-index:2147483647;max-width:calc(100vw - 32px)';
const shadow=host.attachShadow({mode:'open'});
shadow.innerHTML=`<style>
:host{all:initial;color-scheme:dark;font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#edf3f7}
*{box-sizing:border-box} [hidden]{display:none!important}
section{--surface:#15202b;--muted:#b4c2cd;--line:#354654;background:var(--surface);border:1px solid #455866;border-radius:16px;width:384px;max-width:calc(100vw - 32px);max-height:calc(100dvh - 32px);overflow:auto;box-shadow:0 12px 40px #0006}
header{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--line)}
.mark{width:36px;height:36px;flex-shrink:0;color:#8bc8fd}h2{font-size:18px;letter-spacing:-.3px;line-height:1.3;margin:0}header p{margin:4px 0 0;font-size:12px;color:var(--muted)}
.title{flex:1}.icon-button{flex:0 0 44px;padding:0;font-size:22px;background:transparent;color:var(--muted)}
.body{padding:16px 20px;display:grid;gap:16px}p{margin:0}button,input,select{font:inherit}
button{min-height:44px;border:1px solid var(--line);border-radius:8px;background:#202f3b;color:#edf3f7;padding:10px 14px;font-weight:600;cursor:pointer;transition:background 150ms}
button:hover:not(:disabled){background:#2d4050}button:active:not(:disabled){background:#384f62}button:disabled{opacity:.45;cursor:default}
:is(button,select,input,summary,a):focus-visible{outline:3px solid #9dd3ff;outline-offset:3px}
.field-label{display:block;font-size:13px;font-weight:600;margin-bottom:8px}select{width:100%;min-height:44px;background:#101923;color:#edf3f7;border:1px solid #526775;border-radius:8px;padding:8px 12px}
.file-field{margin-top:12px}.file-field input{width:100%;font-size:12px;min-height:44px}.file-field input::file-selector-button{border:1px solid var(--line);padding:8px;background:#202f3b;color:#edf3f7;border-radius:6px;margin-right:8px}
.hint{font-size:12px;color:var(--muted);margin-top:8px}.check{display:flex;align-items:center;gap:12px;min-height:44px;cursor:pointer}.check input{accent-color:#8bc8fd;width:18px;height:18px;margin:0;flex-shrink:0}.check strong{display:block;font-size:13px}.check small{display:block;color:var(--muted);font-size:12px}
.status-box{border-left:1px solid #8bc8fd;padding:2px 0 2px 12px}.state{font-size:12px;font-weight:700;color:#8bc8fd;display:flex;align-items:center;gap:8px}.dot{width:7px;height:7px;border-radius:50%;background:currentColor;flex-shrink:0}.status-box p{font-size:13px;margin-top:6px;overflow-wrap:anywhere}
.status-box[data-phase="waiting"]{border-color:#efc77b}.status-box[data-phase="waiting"] .state{color:#efc77b}.status-box[data-phase="error"]{border-color:#ffaaa5}.status-box[data-phase="error"] .state{color:#ffaaa5}.status-box[data-phase="complete"]{border-color:#a1d6b7}.status-box[data-phase="complete"] .state{color:#a1d6b7}
#countdown{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
dl{margin:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 12px}dl div{display:flex;flex-direction:column;gap:4px}dt{font-size:12px;color:var(--muted)}dd{order:-1;margin:0;font-size:22px;font-weight:650;font-variant-numeric:tabular-nums;line-height:1.2;overflow-wrap:anywhere}.minor{display:flex;justify-content:space-between;gap:12px;font-size:12px;color:var(--muted);margin-top:16px;border-top:1px solid var(--line);padding-top:12px}
.actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.primary{grid-column:1/-1;background:#8bc8fd;color:#0a1d2c;border-color:#8bc8fd}.primary:hover:not(:disabled){background:#b2daff}.primary:active:not(:disabled){background:#73b5ee}.primary.danger{background:#ffb1aa;border-color:#ffb1aa;color:#39130f}.primary.danger:hover:not(:disabled){background:#ffcdc8}.primary.danger:active:not(:disabled){background:#f39a92}
.footer{display:grid;grid-template-columns:auto 1fr;gap:0 12px;border-top:1px solid var(--line);padding-top:12px}.footer #account{grid-column:1/-1;margin:0 0 4px}.footer details{min-width:0}.footer details[open]{grid-column:1/-1}.footer summary{justify-content:flex-end}.footer details[open] summary{justify-content:flex-start}.text-button{min-height:44px;display:inline-flex;align-items:center;font-size:12px;padding:8px 0;background:none;border-color:transparent;color:var(--muted)}.text-button:hover:not(:disabled){background:none;color:#edf3f7;text-decoration:underline}
details{font-size:12px;color:var(--muted)}summary{cursor:pointer;min-height:44px;display:flex;align-items:center;gap:8px}summary::before{content:'+';font-size:16px}details[open] summary::before{content:'−'}details p{margin-bottom:10px}details a{color:#a8d5ff}
#mini{max-width:calc(100vw - 32px);box-shadow:0 8px 28px #0006;border-color:#455866;text-align:left}.mini-title{display:block}.mini-state{display:block;font-size:12px;font-weight:400;color:#b4c2cd;overflow-wrap:anywhere}
@media(max-width:380px){header,.body{padding:16px}.body{gap:16px}dl{gap:12px 8px}dd{font-size:20px}}
@media(prefers-reduced-motion:reduce){button{transition:none}}
</style>
<section id="panel" role="region" aria-label="Tweet Cleaner">
<header><svg class="mark" viewBox="0 0 36 36" fill="none" aria-hidden="true"><rect x="5" y="5" width="24" height="28" rx="5" stroke="currentColor" stroke-width="2"/><path d="M11 13h12M11 19h8M23 4v6M20 7h6M24 24l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="title"><h2>Tweet Cleaner</h2><p>Gratuito · v${VERSION}</p></div><button id="hide" class="icon-button" aria-label="Minimizar painel" title="Minimizar">−</button></header>
<div class="body">
<div><label class="field-label" for="mode">O que limpar</label><select id="mode" aria-describedby="source-hint"><option value="timeline">Posts e reposts desta página</option><option value="archive">Posts do arquivo do X</option><option value="bookmarks">Bookmarks (salvos)</option><option value="likes">Likes (curtidas)</option></select><p class="hint" id="source-hint">Busca enquanto rola a página. Posts antigos podem não aparecer.</p><a class="text-button" id="source-link" hidden>Abrir a página no X ↗</a><div id="file-field" class="file-field" hidden><label class="field-label" for="files">Arquivos de posts</label><input id="files" type="file" accept=".js,.json" multiple><p class="hint" id="file-info">Selecione tweets.js ou tweets-part*.js.</p></div></div>
<div id="adult-field" hidden><label class="check" for="adult"><input id="adult" type="checkbox"><span><strong>Somente conteúdo adulto</strong><small>Apenas avisos explícitos do X em português ou inglês.</small></span></label><p class="hint">Sem rótulo adulto visível, o item fica intacto. “Conteúdo sensível” sozinho não conta.</p></div>
<label class="check" for="dry"><input id="dry" type="checkbox" checked><span><strong>Prévia sem apagar</strong><small id="preview-hint">Salva os IDs para limpar depois, sem repetir a busca.</small></span></label>
<div id="status-box" class="status-box" data-phase="ready"><div class="state"><span class="dot" aria-hidden="true"></span><span id="phase">Pronto para começar</span></div><p id="status" role="status" aria-live="polite">Faça uma prévia ou desmarque a opção para excluir diretamente.</p><p id="countdown" hidden></p></div>
<div><dl aria-label="Progresso desta execução"><div><dt id="deleted-label">Excluídos</dt><dd id="deleted">0</dd></div><div><dt>Pendentes</dt><dd id="pending">0</dd></div><div><dt>Falhas</dt><dd id="failed">0</dd></div><div><dt>Encontrados</dt><dd id="scanned">0</dd></div><div><dt>Já ausentes</dt><dd id="gone">0</dd></div><div><dt>Já processados</dt><dd id="skipped">0</dd></div></dl><div class="minor"><span id="requests">0 requisições</span><span id="completed">0 ações salvas</span></div></div>
<div class="actions"><button id="start" class="primary">Encontrar posts</button><button id="pause" disabled>Pausar</button><button id="stop" disabled>Parar</button></div>
<div class="footer"><p class="hint" id="account"></p><button id="report" class="text-button">Exportar relatório</button><details><summary>Como funciona e cuidados</summary><p>Excluir posts é permanente. Remover likes ou bookmarks só retira essas interações; os posts permanecem. Cada modo exige sua confirmação.</p><p>Sem teto de itens. Ao receber um limite do X, aguarda e retoma automaticamente. Deixe esta aba aberta e o computador acordado.</p><p>Para posts, execute também nas abas Respostas e Reposts. O arquivo do X é usado apenas para posts. Likes e bookmarks vêm de suas respectivas páginas.</p><p>O X também permite limpar todos os bookmarks pelo menu da página de salvos. <a href="https://help.x.com/en/using-x/bookmarks" target="_blank" rel="noopener noreferrer">Instruções do X</a>.</p><p>O progresso de cada modo fica localmente neste site. Em uma nova rodada, likes ou bookmarks visíveis podem ser reconsiderados caso tenham sido marcados novamente; atualize a página antes de retomar.</p><p>O X pode restringir automação pela interface. <a href="https://help.x.com/en/rules-and-policies/x-automation" target="_blank" rel="noopener noreferrer">Regras de automação do X</a>.</p></details></div>
</div></section><button id="mini" hidden aria-label="Expandir Tweet Cleaner"><span class="mini-title">Tweet Cleaner</span><span id="mini-state" class="mini-state">Pronto para começar</span></button>`;
doc.body.appendChild(host);const el=id=>shadow.getElementById(id);
el('mode').value=initialMode;
try{loadProgress();}catch(e){host.style.display='none';root.alert(e.message);return {error:e.message};}
let phase='ready',message='Faça uma prévia ou desmarque a opção para executar a limpeza.',waitUntil=0;
const phaseNames={ready:'Pronto para começar',scanning:'Encontrando posts',deleting:'Exclusão em andamento',waiting:'Aguardando o X',paused:'Execução pausada',stopping:'Encerrando',stopped:'Execução parada',complete:'Execução concluída',error:'Execução interrompida'};
const number=n=>n.toLocaleString('pt-BR');
function update(nextMessage,nextPhase){
 if(nextMessage)message=nextMessage;if(nextPhase)phase=nextPhase;
 const shown=stopped&&busy?'stopping':paused&&busy?'paused':phase;
 const phaseLabel=shown==='scanning'?'Encontrando '+noun():shown==='deleting'&&interactions()?'Remoção em andamento':phaseNames[shown];
 if(el('phase').textContent!==phaseLabel)el('phase').textContent=phaseLabel;el('status-box').dataset.phase=shown;
 const statusText=shown==='paused'?'Pausado após a requisição atual. Clique Retomar para continuar.':message;
 if(el('status').textContent!==statusText)el('status').textContent=statusText;
 for(const name of ['deleted','gone','failed','skipped','scanned'])el(name).textContent=number(stats[name]);
 el('pending').textContent=number(previewSource===sourceKey()?preview.size:0);
 el('requests').textContent=number(stats.requests)+' requisições';el('completed').textContent=number(done.size)+' ações salvas';
 el('account').textContent='Conta conectada: @'+account;
 el('countdown').hidden=!waitUntil||shown!=='waiting';
 if(waitUntil){const seconds=Math.max(0,Math.ceil((waitUntil-Date.now())/1000));el('countdown').textContent='Retomada automática em '+Math.floor(seconds/60)+'min '+String(seconds%60).padStart(2,'0')+'s';}
 el('deleted-label').textContent=interactions()?'Removidos':'Excluídos';
 el('mini-state').textContent=phaseLabel+' · '+number(stats.deleted)+(interactions()?' removidos':' excluídos');
}
function savePreview(){root.localStorage.setItem(previewKey(),JSON.stringify({source:previewSource,items:[...preview.values()]}));}
async function wait(ms){const end=Date.now()+ms;let last=-1;while(!stopped&&(Date.now()<end||paused)){if(waitUntil&&Math.floor(Date.now()/1000)!==last){last=Math.floor(Date.now()/1000);update();}await new Promise(r=>root.setTimeout(r,250));}}
function assertAccount(){if(identity()!==account)throw Error('A conta ou página mudou. Execução interrompida.');if(!scopeAllowed(root.location.pathname,account,el('mode').value))throw Error('Abra a página correta para '+noun()+'. O modo escolhido não pode operar nesta página.');}
function save(item){done.add(item.kind+':'+item.id);root.localStorage.setItem(progressKey(),JSON.stringify({version:1,done:[...done]}));}
async function remove(item){
 for(let attempt=0;attempt<4&&!stopped;attempt++){
  await wait(0);if(stopped)return 'stopped';assertAccount();
  const csrf=doc.cookie.match(/(?:^|;\s*)ct0=([^;]+)/)?.[1];if(!csrf)throw Error('Sessão expirada. Entre novamente no X.');
  if(!itemMatchesFilter(item,el('mode').value,adultOnly()))throw Error('O item não pertence ao modo ou filtro escolhido.');
  const {operation:op,queryId,variables}=mutationFor(item);
  let response;
  stats.requests++;update();
  try{response=await root.fetch('https://x.com/i/api/graphql/'+queryId+'/'+op,{method:'POST',credentials:'include',signal:AbortSignal.timeout(30000),headers:{authorization:'Bearer '+BEARER,'x-csrf-token':csrf,'content-type':'application/json','x-twitter-auth-type':'OAuth2Session','x-twitter-active-user':'yes'},body:JSON.stringify({queryId,variables})});}
  catch(e){if(attempt===3)return 'failed';update('Falha de rede. Tentando novamente…');await wait(2000*2**attempt);continue;}
  const body=await response.json().catch(()=>null),result=classify(response.status,body,item.kind);
  if(result==='rate'){const ms=rateWait(response.headers.get('x-rate-limit-reset'),Date.now());waitUntil=Date.now()+ms;update('O X pediu uma pausa. A lista está salva; a execução retoma automaticamente.','waiting');await wait(ms);waitUntil=0;if(!stopped)update(activeMessage(),'deleting');attempt--;continue;}
  if(result==='fatal')throw Error(`X respondeu HTTP ${response.status}. Sessão ou API incompatível; nenhuma conclusão de sucesso foi registrada.`);
  if(result==='retry'&&attempt<3){await wait(2000*2**attempt);continue;}
  return result==='retry'?'failed':result;
 }
 return 'stopped';
}
function visibleItems(){
 const items=new Map();for(const article of doc.querySelectorAll('article[data-testid="tweet"]')){
  const time=article.querySelector('a[href*="/status/"] time'),t=parseLink(time?.closest('a')?.getAttribute('href'));if(!t)continue;
  const mode=el('mode').value;
  const kind=mode==='bookmarks'?(article.querySelector('[data-testid="removeBookmark"]')?'bookmark':null):mode==='likes'?(article.querySelector('[data-testid="unlike"]')?'like':null):t.author===account?'tweet':article.querySelector('[data-testid="unretweet"]')?'retweet':null;
  if(kind){if(adultOnly()&&!hasAdultWarning(article))continue;items.set(kind+':'+t.id,{id:t.id,kind,...(adultOnly()?{adult:true}:{})});}
 }return [...items.values()];
}
async function process(items){
 for(const item of items){if(stopped)break;await wait(0);if(stopped)break;assertAccount();const id=item.kind+':'+item.id;if(attempted.has(id))continue;
  if(!itemMatchesFilter(item,el('mode').value,adultOnly()))throw Error('A lista contém um item de outro modo ou sem classificação adulta; execução interrompida.');
  attempted.add(id);stats.scanned++;
  // Interactions can be marked again. A fresh preview or live marker is eligible.
  if(interactions()&&!dry&&done.delete(id))root.localStorage.setItem(progressKey(),JSON.stringify({version:1,done:[...done]}));
  if(done.has(id)&&!interactions()){stats.skipped++;preview.delete(id);savePreview();update();continue;}
  preview.set(id,item);savePreview();
  if(dry){update('Prévia: IDs salvos para '+(interactions()?'remover '+targetNoun():'excluir posts')+' sem repetir a busca.','scanning');continue;}
  if(phase!=='deleting')update(activeMessage(),'deleting');
  const result=await remove(item);if(result==='ok'||result==='gone'){save(item);preview.delete(id);savePreview();result==='ok'?stats.deleted++:stats.gone++;failures.delete(id);}else if(result!=='stopped'){stats.failed++;failures.set(id,result);}
  update();await wait(800);
 }
}
async function run(){
 const cached=!dry&&preview.size>0;
 if(cached){update((interactions()?'Removendo ':'Excluindo ')+targetNoun()+' pelos IDs salvos; depois a busca continua automaticamente.','deleting');await process([...preview.values()]);}
 if(el('mode').value==='archive'){if(queue.length)await process(queue);else if(!cached)throw Error('Selecione arquivos tweets.js/tweets-part*.js.');}
 else if(!stopped){root.scrollTo(0,0);await wait(700);let idle=0,passes=0;
  while(!stopped&&idle<12){assertAccount();const before=attempted.size;await process(visibleItems());if(stopped)break;const bottom=root.scrollY+root.innerHeight>=doc.documentElement.scrollHeight-100;idle=bottom&&attempted.size===before?idle+1:0;root.scrollBy(0,Math.round(root.innerHeight*.65));await wait(1500);if(++passes>20000)throw Error('Limite de varredura atingido. Exporte o relatório e reinicie.');}
 }
 waitUntil=0;
 update(stopped?'Parado. Os IDs encontrados e o progresso foram salvos.':dry?`${number(preview.size)} IDs salvos. Desmarque Prévia sem apagar para ${interactions()?'remover '+targetNoun():'excluir e continuar'}.`:`Execução concluída com ${stats.failed} falhas. Atualize a página para conferir os restantes. `+(interactions()?'Os posts permanecem no X; só '+targetNoun()+' foram removidos.':'Posts antigos podem exigir o arquivo do X.'),stopped?'stopped':'complete');
}
function startLabel(){el('start').textContent=el('dry').checked?'Encontrar '+targetNoun():interactions()?'Remover '+targetNoun():previewSource===sourceKey()&&preview.size?'Excluir e continuar':'Excluir disponíveis';el('start').className='primary'+(el('dry').checked?'':' danger');}
function sourceControls(){const mode=el('mode').value;el('file-field').hidden=mode!=='archive';el('adult-field').hidden=!interactions();el('source-link').hidden=!interactions()||scopeAllowed(root.location.pathname,account,mode);el('source-link').href='https://x.com'+(mode==='bookmarks'?'/i/bookmarks':'/'+account+'/likes');el('source-hint').textContent=mode==='archive'?'O arquivo é lido localmente e nunca é enviado.':interactions()?'Usa '+(mode==='bookmarks'?'a página Bookmarks':'a aba Likes do seu perfil')+'. Remove apenas '+noun()+'; os posts permanecem.':'Busca enquanto rola a página. Posts antigos podem não aparecer.';startLabel();}
el('dry').onchange=()=>{startLabel();update(el('dry').checked?'A prévia encontra e salva IDs. Nenhuma ação é enviada.':interactions()?'Você confirmará a remoção de '+noun()+'. Os posts permanecem no X.':'A exclusão é permanente. Você confirmará a conta antes de começar.','ready');};
el('mode').onchange=()=>{try{loadProgress();Object.keys(stats).forEach(k=>stats[k]=0);failures.clear();sourceControls();update('Modo alterado. Escolha prévia ou confirme a ação para começar.','ready');}catch(e){update(e.message,'error');}};
el('adult').onchange=()=>{try{loadProgress();Object.keys(stats).forEach(k=>stats[k]=0);failures.clear();startLabel();update(adultOnly()?'Filtro ativo: apenas avisos explícitos de conteúdo adulto do X. Sem classificação visível, nenhuma ação é enviada.':'Filtro desativado: todos os '+noun()+' encontrados são elegíveis.','ready');}catch(e){update(e.message,'error');}};
el('files').onchange=async()=>{queue=[];try{const combined=new Map();for(const file of el('files').files)for(const item of parseArchive(await file.text()))combined.set(item.id,item);queue=[...combined.values()];preview.clear();previewSource=sourceKey();savePreview();startLabel();el('file-info').textContent=number(queue.length)+' IDs únicos carregados.';update(queue.length+' IDs únicos carregados localmente.','ready');}catch(e){el('file-info').textContent='Não foi possível ler os arquivos.';update(e.message,'error');}};
el('start').onclick=async()=>{
 if(busy)return;dry=el('dry').checked;try{assertAccount();}catch(e){update(e.message,'error');return;}
 if(el('mode').value==='archive'&&!queue.length&&!(previewSource===sourceKey()&&preview.size)){update('Selecione os arquivos primeiro.','error');return;}
 const phrase=(interactions()?'REMOVER '+noun().toUpperCase()+(adultOnly()?' ADULTOS':''):'EXCLUIR')+' @'+account;
 if(!dry&&root.prompt(`${interactions()?'Remover '+targetNoun()+', preservando os posts':'Excluir posts permanentemente'} de @${account}, aguardando os limites do X? ${adultOnly()?'Só itens com aviso adulto explícito detectado na prévia ou página. ':''}A automação do site pode resultar em suspensão pelo X. Digite ${phrase} para iniciar.`)!==phrase)return;
 if(!root.navigator.locks){update('Use Chrome atualizado: este navegador não oferece trava de execução.','error');return;}
 await root.navigator.locks.request(key,{ifAvailable:true},async lock=>{
  if(!lock){update('Já existe uma execução nesta conta em outra aba.','error');return;}
  try{done=checkpoint(root.localStorage.getItem(progressKey()));}catch(e){update(e.message,'error');return;}
  try{if(previewSource!==sourceKey()||dry){preview.clear();previewSource=sourceKey();savePreview();}}catch(e){update('Interrompido: '+e.message,'error');return;}
  busy=true;stopped=false;paused=false;attempted.clear();Object.keys(stats).forEach(k=>stats[k]=0);failures.clear();
  ['start','mode','files','dry','adult'].forEach(id=>el(id).disabled=true);el('pause').disabled=el('stop').disabled=false;el('pause').textContent='Pausar';
  update(dry?'Encontrando IDs sem alterar o X. Você pode parar e usar a lista parcial.':activeMessage(),dry?'scanning':'deleting');
  try{await run();}catch(e){waitUntil=0;phase='error';message='Interrompido: '+e.message;}finally{busy=false;paused=false;['start','mode','files','dry','adult'].forEach(id=>el(id).disabled=false);el('pause').disabled=el('stop').disabled=true;startLabel();update();}
 });
};
el('pause').onclick=()=>{paused=!paused;el('pause').textContent=paused?'Retomar':'Pausar';update();};
el('stop').onclick=()=>{stopped=true;paused=false;update('Parando após a requisição atual…');};
el('hide').onclick=()=>{el('panel').hidden=true;el('mini').hidden=false;el('mini').focus();};
function show(){el('panel').hidden=false;el('mini').hidden=true;host.style.display='';}
el('mini').onclick=()=>{show();el('hide').focus();};
el('report').onclick=()=>{const report={version:VERSION,account,date:new Date().toISOString(),mode:el('mode').value,filter:adultOnly()?'adult-warning':'all',simulation:dry,stats,completed:[...done],pending:[...preview.values()],failures:[...failures]};const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=doc.createElement('a');a.href=url;a.download='tweet-cleaner-report.json';a.click();root.setTimeout(()=>URL.revokeObjectURL(url),1000);};
root.TweetCleaner={version:VERSION,show,stop:()=>{stopped=true;paused=false;}};sourceControls();update();
return {opened:true,version:VERSION};
})(typeof window==='undefined'?{}:window);

});