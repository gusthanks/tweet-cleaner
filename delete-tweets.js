/* MIT; derived from backzso/tweetdelete (c) 2026 backzso. */
(function(root){
'use strict';
const VERSION='3.2.0';
// BEGIN TRANSLATIONS (generated from locales/pt-BR.json)
const PORTUGUESE={"Invalid operation or ID.":"Operação ou ID inválido.","Use a tweets.js or tweets-part*.js file.":"Use um arquivo tweets.js ou tweets-part*.js.","Invalid ID in the archive.":"ID inválido no arquivo.","Invalid saved progress; export it before clearing storage.":"Progresso salvo inválido; exporte antes de limpar o armazenamento.","Open your own profile, Likes or Bookmarks on X. The signed-in account must be visible.":"Abra o próprio perfil, Likes ou Bookmarks no X. A conta conectada precisa estar visível.","The account or page changed. Run stopped.":"A conta ou página mudou. Execução interrompida.","Session expired. Sign in to X again.":"Sessão expirada. Entre novamente no X.","The item does not match the selected mode or filter.":"O item não pertence ao modo ou filtro escolhido.","The list contains an item from another mode or without an adult label; run stopped.":"A lista contém um item de outro modo ou sem classificação adulta; execução interrompida.","Select tweets.js/tweets-part*.js files.":"Selecione arquivos tweets.js/tweets-part*.js.","Scan limit reached. Export the report and restart.":"Limite de varredura atingido. Exporte o relatório e reinicie.","Open your profile on x.com.":"Abra seu perfil em x.com.","Stop the old version and reload the X tab to open the new version.":"Pare a versão antiga e recarregue a aba do X para abrir a nova versão.","Removing {items}. Posts remain on X.":"Removendo {items}. Os posts permanecem no X.","Deleting available posts. Progress is saved after every success.":"Excluindo os posts disponíveis. O progresso é salvo a cada sucesso.","Free · v{version}":"Gratuito · v{version}","What to clean":"O que limpar","Posts and reposts on this page":"Posts e reposts desta página","Posts from your X archive":"Posts do arquivo do X","Bookmarks":"Bookmarks (salvos)","Likes":"Likes (curtidas)","Searches while scrolling. Older posts may not appear.":"Busca enquanto rola a página. Posts antigos podem não aparecer.","Open the page on X ↗":"Abrir a página no X ↗","Post archive files":"Arquivos de posts","Select tweets.js or tweets-part*.js.":"Selecione tweets.js ou tweets-part*.js.","Adult content only":"Somente conteúdo adulto","Only explicit X warnings in English or Portuguese.":"Apenas avisos explícitos do X em português ou inglês.","Without a visible adult label, the item stays untouched. “Sensitive content” alone does not qualify.":"Sem rótulo adulto visível, o item fica intacto. “Conteúdo sensível” sozinho não conta.","Preview without changes":"Prévia sem apagar","Saves IDs for later cleanup without repeating the search.":"Salva os IDs para limpar depois, sem repetir a busca.","Pending":"Pendentes","Failed":"Falhas","Found":"Encontrados","Already absent":"Já ausentes","Already processed":"Já processados","Stop":"Parar","Export report":"Exportar relatório","How it works & precautions":"Como funciona e cuidados","Deleting posts is permanent. Removing likes or bookmarks only removes those interactions; the posts remain. Each mode requires your confirmation.":"Excluir posts é permanente. Remover likes ou bookmarks só retira essas interações; os posts permanecem. Cada modo exige sua confirmação.","No item cap. When X asks for a pause, the run waits and resumes automatically. Keep this tab open and your computer awake.":"Sem teto de itens. Ao receber um limite do X, aguarda e retoma automaticamente. Deixe esta aba aberta e o computador acordado.","For posts, also run on Replies and Reposts. The X archive is used only for posts. Likes and bookmarks come from their own pages.":"Para posts, execute também nas abas Respostas e Reposts. O arquivo do X é usado apenas para posts. Likes e bookmarks vêm de suas respectivas páginas.","Progress for each mode stays locally on this site. Visible likes or bookmarks can be reconsidered in a new run if you marked them again; refresh the page before resuming.":"O progresso de cada modo fica localmente neste site. Em uma nova rodada, likes ou bookmarks visíveis podem ser reconsiderados caso tenham sido marcados novamente; atualize a página antes de retomar.","X also lets you clear all bookmarks from the menu on the Bookmarks page. ":"O X também permite limpar todos os bookmarks pelo menu da página de salvos. ","X instructions":"Instruções do X","X may restrict automation through its website. ":"O X pode restringir automação pela interface. ","X automation rules":"Regras de automação do X","Preview first, or uncheck the option to start cleanup.":"Faça uma prévia ou desmarque a opção para executar a limpeza.","Ready to start":"Pronto para começar","Finding posts":"Encontrando posts","Deletion in progress":"Exclusão em andamento","Waiting for X":"Aguardando o X","Run paused":"Execução pausada","Stopping":"Encerrando","Run stopped":"Execução parada","Run complete":"Execução concluída","Run interrupted":"Execução interrompida","Finding {items}":"Encontrando {items}","Removal in progress":"Remoção em andamento","Paused after the current request. Click Resume to continue.":"Pausado após a requisição atual. Clique Retomar para continuar.","1 request":"1 requisição","{count} requests":"{count} requisições","1 saved action":"1 ação salva","{count} saved actions":"{count} ações salvas","Signed in as @{account}":"Conta conectada: @{account}","Resumes automatically in {minutes}m {seconds}s":"Retomada automática em {minutes}min {seconds}s","Removed":"Removidos","Deleted":"Excluídos","{phase} · {count} removed":"{phase} · {count} removidos","{phase} · {count} deleted":"{phase} · {count} excluídos","Open the correct page for {items}. The selected mode cannot run here.":"Abra a página correta para {items}. O modo escolhido não pode operar nesta página.","X returned HTTP {status}. Session or API incompatible; no success was recorded.":"X respondeu HTTP {status}. Sessão ou API incompatível; nenhuma conclusão de sucesso foi registrada.","Preview: IDs saved to remove {items} without repeating the search.":"Prévia: IDs salvos para remover {items} sem repetir a busca.","Preview: IDs saved to delete posts without repeating the search.":"Prévia: IDs salvos para excluir posts sem repetir a busca.","Removing {items} using saved IDs; the search then continues automatically.":"Removendo {items} pelos IDs salvos; depois a busca continua automaticamente.","Deleting {items} using saved IDs; the search then continues automatically.":"Excluindo {items} pelos IDs salvos; depois a busca continua automaticamente.","Stopped. Found IDs and progress were saved.":"Parado. Os IDs encontrados e o progresso foram salvos.","{count} IDs saved. Uncheck Preview without changes to remove {items}.":"{count} IDs salvos. Desmarque Prévia sem apagar para remover {items}.","{count} IDs saved. Uncheck Preview without changes to delete and continue.":"{count} IDs salvos. Desmarque Prévia sem apagar para excluir e continuar.","Run complete with {failures} failures. Refresh the page to check what remains. {detail}":"Execução concluída com {failures} falhas. Atualize a página para conferir os restantes. {detail}","Posts remain on X; only {items} were removed.":"Os posts permanecem no X; só {items} foram removidos.","Older posts may need the X archive.":"Posts antigos podem exigir o arquivo do X.","Find {items}":"Encontrar {items}","Remove {items}":"Remover {items}","Delete and continue":"Excluir e continuar","Delete available posts":"Excluir disponíveis","Uses the Bookmarks page. Only bookmarks are removed; posts remain.":"Usa a página Bookmarks. Remove apenas bookmarks; os posts permanecem.","Uses Likes in X History. Only likes are removed; posts remain.":"Usa Likes no Histórico do X. Remove apenas likes; os posts permanecem.","You will confirm removing {items}. Posts remain on X.":"Você confirmará a remoção de {items}. Os posts permanecem no X.","Filter off: all found {items} are eligible.":"Filtro desativado: todos os {items} encontrados são elegíveis.","{count} unique IDs loaded.":"{count} IDs únicos carregados.","{count} unique IDs loaded locally.":"{count} IDs únicos carregados localmente.","Could not read the files.":"Não foi possível ler os arquivos.","REMOVE {items} ADULT @{account}":"REMOVER {items} ADULTOS @{account}","REMOVE {items} @{account}":"REMOVER {items} @{account}","DELETE @{account}":"EXCLUIR @{account}","{action} for @{account}, waiting for X rate limits? {filter}Website automation may result in suspension by X. Type {phrase} to start.":"{action} de @{account}, aguardando os limites do X? {filter}A automação do site pode resultar em suspensão pelo X. Digite {phrase} para iniciar.","Remove {items}, keeping the posts":"Remover {items}, preservando os posts","Permanently delete posts":"Excluir posts permanentemente","Only items with an explicit adult warning detected in the preview or page. ":"Só itens com aviso adulto explícito detectado na prévia ou página. ","Stopped: {error}":"Interrompido: {error}","Network error. Retrying…":"Falha de rede. Tentando novamente…","X asked for a pause. The list is saved; the run resumes automatically.":"O X pediu uma pausa. A lista está salva; a execução retoma automaticamente.","Preview finds and saves IDs. No changes are sent.":"A prévia encontra e salva IDs. Nenhuma ação é enviada.","Deletion is permanent. You will confirm the account before starting.":"A exclusão é permanente. Você confirmará a conta antes de começar.","Mode changed. Preview first or confirm the action to start.":"Modo alterado. Escolha prévia ou confirme a ação para começar.","Filter on: only explicit X adult content warnings. Without a visible label, no changes are sent.":"Filtro ativo: apenas avisos explícitos de conteúdo adulto do X. Sem classificação visível, nenhuma ação é enviada.","Select the files first.":"Selecione os arquivos primeiro.","Use an up-to-date Chrome: this browser does not support execution locks.":"Use Chrome atualizado: este navegador não oferece trava de execução.","This account already has a run in another tab.":"Já existe uma execução nesta conta em outra aba.","Finding IDs without changing X. You can stop and use the partial list.":"Encontrando IDs sem alterar o X. Você pode parar e usar a lista parcial.","Stopping after the current request…":"Parando após a requisição atual…","The archive is read locally and never uploaded.":"O arquivo é lido localmente e nunca é enviado.","Pause":"Pausar","Resume":"Retomar","Minimize panel":"Minimizar painel","Minimize":"Minimizar","Expand Tweet Cleaner":"Expandir Tweet Cleaner","Progress for this run":"Progresso desta execução","Switch to Portuguese":"Mudar para português","Switch to English":"Mudar para inglês","Could not save the language preference.":"Não foi possível salvar a preferência de idioma.","Free. In your browser.":"Gratuito. No seu navegador.","Your history, under your control.":"Seu histórico, sob seu controle.","Delete posts and reposts, or remove bookmarks and likes, with a panel inside X.":"Exclua posts e reposts ou remova bookmarks e likes com um painel dentro do X.","Open your profile, Likes or Bookmarks on X.":"Abra seu perfil, Likes ou Bookmarks no X.","Open the panel below and choose what to clean.":"Abra o painel abaixo e escolha o que limpar.","Preview first, or confirm the action.":"Faça uma prévia ou confirme a ação.","Open panel in this tab":"Abrir painel nesta aba","Open X ↗":"Abrir o X ↗","Privacy":"Privacidade","The extension only accesses the tab when you open the panel.":"A extensão só acessa a aba quando você abre o painel.","Opening the panel…":"Abrindo o painel…","Open your profile, Likes or Bookmarks on X, wait for it to load, and try again.":"Abra seu perfil, Likes ou Bookmarks no X, aguarde carregar e tente novamente.","Could not identify the account. Refresh the page and try again.":"Não foi possível identificar a conta. Atualize a página e tente novamente.","Panel open on X. No changes start without your confirmation.":"Painel aberto no X. Nenhuma ação começa sem sua confirmação.","Could not open the panel. Refresh the tab and try again.":"Não foi possível abrir o painel. Atualize a aba e tente novamente.","{items} with adult content warnings":"{items} de conteúdo adulto"};
// END TRANSLATIONS
const LANGUAGE_KEY='tweet-cleaner:language';
const extensionStorage=root.chrome?.storage;
let language='en';
try{language=(root.TweetCleanerInitialLanguage||(extensionStorage?null:root.localStorage?.getItem(LANGUAGE_KEY)))==='pt-BR'?'pt-BR':'en';}catch{}
delete root.TweetCleanerInitialLanguage;
const msg=(source,values={})=>({source,values});
function textOf(value){return value?.localizedMessage?textOf(value.localizedMessage):value?.source?t(value.source,value.values):typeof value==='number'?value.toLocaleString(language==='pt-BR'?'pt-BR':'en-US'):value?.message||String(value);}
function t(source,values={}){return (language==='pt-BR'?(PORTUGUESE[source]||source):source).replace(/\{(\w+)\}/g,(_,name)=>textOf(values[name]??'{'+name+'}'));}
function localizedError(source,values={}){const error=Error(t(source,values));error.localizedMessage=msg(source,values);return error;}
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
 if(mode==='likes')return /^\/i\/history\/likes\/?$/i.test(path)||path.toLowerCase().replace(/\/$/,'')==='/'+account+'/likes';
 return ['timeline','archive'].includes(mode)&&new RegExp('^/'+account+'(?:/(?:with_replies|retweets|reposts|media))?/?$','i').test(path);
}
function normalizeSource(source,account){
 if(!/^[a-z0-9_]+$/.test(account||''))return source;
 return source.replace(new RegExp('^likes:(?:/'+account+'/likes|/i/history/likes)/?(?=:adult$|$)','i'),'likes:/i/history/likes');
}
function mutationFor(item){
 if(typeof item?.id!=='string'||!/^\d+$/.test(item.id)||!Object.prototype.hasOwnProperty.call(MUTATIONS,item.kind))throw localizedError("Invalid operation or ID.");
 const spec=MUTATIONS[item.kind];const variables=item.kind==='retweet'?{source_tweet_id:item.id,dark_request:false}:item.kind==='tweet'?{tweet_id:item.id,dark_request:false}:{tweet_id:item.id};
 return {operation:spec.operation,queryId:spec.queryId,variables};
}
function parseArchive(text){
 const json=text.trim().replace(/^window\.YTD\.(?:tweets?|tweet_headers)\.part\d+\s*=\s*/,'').replace(/;\s*$/,'');
 const entries=JSON.parse(json); if(!Array.isArray(entries))throw localizedError("Use a tweets.js or tweets-part*.js file.");
 const unique=new Map();
 for(const entry of entries){const t=entry.tweet||entry;if(typeof t.id_str!=='string'||!/^\d+$/.test(t.id_str))throw localizedError("Invalid ID in the archive.");unique.set(t.id_str,{id:t.id_str,kind:'tweet'});}
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
function checkpoint(raw){if(!raw)return new Set();const v=JSON.parse(raw);if(v.version!==1||!Array.isArray(v.done)||v.done.some(x=>!/^(tweet|retweet|bookmark|like):\d+$/.test(x)))throw localizedError("Invalid saved progress; export it before clearing storage.");return new Set(v.done);}
const core={validHost,parseLink,parseArchive,classify,rateWait,checkpoint,itemAllowed,itemMatchesFilter,adultWarningLabel,hasAdultWarning,scopeAllowed,normalizeSource,mutationFor};
if(typeof module!=='undefined'&&module.exports){module.exports=core;return;}
const doc=root.document;
if(!validHost(root.location.hostname)){root.alert(t("Open your profile on x.com."));return {error:t("Open your profile on x.com."),errorMessage:msg("Open your profile on x.com.")};}
if(root.TweetCleaner){root.TweetCleaner.setLanguage?.(language,false);root.TweetCleaner.show();return root.TweetCleaner.version===VERSION?{opened:true,version:VERSION}:{error:t("Stop the old version and reload the X tab to open the new version."),errorMessage:msg("Stop the old version and reload the X tab to open the new version.")};}
function identity(){
 const href=doc.querySelector('a[data-testid="AppTabBar_Profile_Link"]')?.getAttribute('href');
 const handle=/^\/([A-Za-z0-9_]+)$/.exec(href||'')?.[1]?.toLowerCase();
 if(!handle||!['timeline','bookmarks','likes'].some(mode=>scopeAllowed(root.location.pathname,handle,mode)))throw localizedError("Open your own profile, Likes or Bookmarks on X. The signed-in account must be visible.");return handle;
}
let account,done,initialMode;
try{account=identity();initialMode=scopeAllowed(root.location.pathname,account,'bookmarks')?'bookmarks':scopeAllowed(root.location.pathname,account,'likes')?'likes':'timeline';}catch(e){root.alert(textOf(e));return {error:textOf(e),errorMessage:e.localizedMessage||null};}
const key='tweet-cleaner:v2:'+account;
const progressKey=()=>key+(['bookmarks','likes'].includes(el('mode').value)?':'+el('mode').value:'');
const interactions=()=>['bookmarks','likes'].includes(el('mode').value);
const adultOnly=()=>interactions()&&el('adult').checked;
const sourceKey=()=>normalizeSource(el('mode').value+':'+root.location.pathname+(adultOnly()?':adult':''),account);
const previewKey=()=>progressKey()+':preview'+(adultOnly()?':adult':'');
const noun=()=>el('mode').value==='bookmarks'?'bookmarks':el('mode').value==='likes'?'likes':'posts';
const targetNoun=()=>adultOnly()?msg('{items} with adult content warnings',{items:noun()}):noun();
const activeMessage=()=>interactions()?msg("Removing {items}. Posts remain on X.",{items:targetNoun()}):msg("Deleting available posts. Progress is saved after every success.");
let queue=[],busy=false,paused=false,stopped=false,dry=true;
let previewSource='',preview=new Map();
function loadProgress(){
 done=checkpoint(root.localStorage.getItem(progressKey()));previewSource='';preview=new Map();
 try{const saved=JSON.parse(root.localStorage.getItem(previewKey())||'null');
  if(saved&&typeof saved.source==='string'&&Array.isArray(saved.items)&&saved.items.every(t=>itemMatchesFilter(t,el('mode').value,adultOnly()))){previewSource=normalizeSource(saved.source,account);preview=new Map(saved.items.map(t=>[t.kind+':'+t.id,t]));}
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
.title{flex:1;min-width:0}.language-button{flex:0 0 44px;padding:8px;font-size:12px}.icon-button{flex:0 0 44px;padding:0;font-size:22px;background:transparent;color:var(--muted)}
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
<header><svg class="mark" viewBox="0 0 36 36" fill="none" aria-hidden="true"><rect x="5" y="5" width="24" height="28" rx="5" stroke="currentColor" stroke-width="2"/><path d="M11 13h12M11 19h8M23 4v6M20 7h6M24 24l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="title"><h2>Tweet Cleaner</h2><p id="copy-0">Free · v${VERSION}</p></div><button id="language" class="language-button" type="button">PT</button><button id="hide" class="icon-button" aria-label="Minimize panel" title="Minimize">−</button></header>
<div class="body">
<div><label class="field-label" for="mode" id="copy-1">What to clean</label><select id="mode" aria-describedby="source-hint"><option value="timeline" id="copy-2">Posts and reposts on this page</option><option value="archive" id="copy-3">Posts from your X archive</option><option value="bookmarks" id="copy-4">Bookmarks</option><option value="likes" id="copy-5">Likes</option></select><p class="hint" id="source-hint">Searches while scrolling. Older posts may not appear.</p><a class="text-button" id="source-link" hidden>Open the page on X ↗</a><div id="file-field" class="file-field" hidden><label class="field-label" for="files" id="copy-8">Post archive files</label><input id="files" type="file" accept=".js,.json" multiple><p class="hint" id="file-info">Select tweets.js or tweets-part*.js.</p></div></div>
<div id="adult-field" hidden><label class="check" for="adult"><input id="adult" type="checkbox"><span><strong id="copy-10">Adult content only</strong><small id="copy-11">Only explicit X warnings in English or Portuguese.</small></span></label><p class="hint" id="copy-12">Without a visible adult label, the item stays untouched. “Sensitive content” alone does not qualify.</p></div>
<label class="check" for="dry"><input id="dry" type="checkbox" checked><span><strong id="copy-13">Preview without changes</strong><small id="preview-hint">Saves IDs for later cleanup without repeating the search.</small></span></label>
<div id="status-box" class="status-box" data-phase="ready"><div class="state"><span class="dot" aria-hidden="true"></span><span id="phase">Ready to start</span></div><p id="status" role="status" aria-live="polite">Preview first, or uncheck the option to delete directly.</p><p id="countdown" hidden></p></div>
<div><dl id="metrics" aria-label="Progress for this run"><div><dt id="deleted-label">Deleted</dt><dd id="deleted">0</dd></div><div><dt id="copy-15">Pending</dt><dd id="pending">0</dd></div><div><dt id="copy-16">Failed</dt><dd id="failed">0</dd></div><div><dt id="copy-17">Found</dt><dd id="scanned">0</dd></div><div><dt id="copy-18">Already absent</dt><dd id="gone">0</dd></div><div><dt id="copy-19">Already processed</dt><dd id="skipped">0</dd></div></dl><div class="minor"><span id="requests">0 requests</span><span id="completed">0 saved actions</span></div></div>
<div class="actions"><button id="start" class="primary">Find posts</button><button id="pause" disabled>Pause</button><button id="stop" disabled>Stop</button></div>
<div class="footer"><p class="hint" id="account"></p><button id="report" class="text-button">Export report</button><details><summary id="copy-22">How it works & precautions</summary><p id="copy-23">Deleting posts is permanent. Removing likes or bookmarks only removes those interactions; the posts remain. Each mode requires your confirmation.</p><p id="copy-24">No item cap. When X asks for a pause, the run waits and resumes automatically. Keep this tab open and your computer awake.</p><p id="copy-25">For posts, also run on Replies and Reposts. The X archive is used only for posts. Likes and bookmarks come from their own pages.</p><p><span id="copy-27">X also lets you clear all bookmarks from the menu on the Bookmarks page. </span><a href="https://help.x.com/en/using-x/bookmarks" target="_blank" rel="noopener noreferrer" id="copy-28">X instructions</a>.</p><p id="copy-26">Progress for each mode stays locally on this site. Visible likes or bookmarks can be reconsidered in a new run if you marked them again; refresh the page before resuming.</p><p><span id="copy-29">X may restrict automation through its website. </span><a href="https://help.x.com/en/rules-and-policies/x-automation" target="_blank" rel="noopener noreferrer" id="copy-30">X automation rules</a>.</p></details></div>
</div></section><button id="mini" hidden aria-label="Expand Tweet Cleaner"><span class="mini-title">Tweet Cleaner</span><span id="mini-state" class="mini-state">Ready to start</span></button>`;
doc.body.appendChild(host);const el=id=>shadow.getElementById(id);
el('mode').value=initialMode;
try{loadProgress();}catch(e){host.style.display='none';root.alert(textOf(e));return {error:textOf(e),errorMessage:e.localizedMessage||null};}
let phase='ready',message=msg("Preview first, or uncheck the option to start cleanup."),waitUntil=0,languageRevision=0;
const phaseNames={"ready": "Ready to start", "scanning": "Finding posts", "deleting": "Deletion in progress", "waiting": "Waiting for X", "paused": "Run paused", "stopping": "Stopping", "stopped": "Run stopped", "complete": "Run complete", "error": "Run interrupted"};
const number=n=>n.toLocaleString(language==='pt-BR'?'pt-BR':'en-US');
function update(nextMessage,nextPhase){
 if(nextMessage)message=nextMessage;if(nextPhase)phase=nextPhase;
 const shown=stopped&&busy?'stopping':paused&&busy?'paused':phase;
 const phaseLabel=shown==='scanning'?t("Finding {items}",{items:targetNoun()}):shown==='deleting'&&interactions()?t("Removal in progress"):t(phaseNames[shown]);
 if(el('phase').textContent!==phaseLabel)el('phase').textContent=phaseLabel;el('status-box').dataset.phase=shown;
 const statusText=shown==='paused'?t("Paused after the current request. Click Resume to continue."):textOf(message);
 if(el('status').textContent!==statusText)el('status').textContent=statusText;
 for(const name of ['deleted','gone','failed','skipped','scanned'])el(name).textContent=number(stats[name]);
 el('pending').textContent=number(previewSource===sourceKey()?preview.size:0);
 el('requests').textContent=t(stats.requests===1?'1 request':'{count} requests',{count:number(stats.requests)});el('completed').textContent=t(done.size===1?'1 saved action':'{count} saved actions',{count:number(done.size)});
 el('account').textContent=t("Signed in as @{account}",{account});
 el('countdown').hidden=!waitUntil||shown!=='waiting';
 if(waitUntil){const seconds=Math.max(0,Math.ceil((waitUntil-Date.now())/1000));el('countdown').textContent=t("Resumes automatically in {minutes}m {seconds}s",{minutes:number(Math.floor(seconds/60)),seconds:String(seconds%60).padStart(2,'0')});}
 el('deleted-label').textContent=t(interactions()?'Removed':'Deleted');
 el('mini-state').textContent=t(interactions()?'{phase} · {count} removed':'{phase} · {count} deleted',{phase:phaseLabel,count:number(stats.deleted)});
}
function savePreview(){root.localStorage.setItem(previewKey(),JSON.stringify({source:previewSource,items:[...preview.values()]}));}
async function wait(ms){const end=Date.now()+ms;let last=-1;while(!stopped&&(Date.now()<end||paused)){if(waitUntil&&Math.floor(Date.now()/1000)!==last){last=Math.floor(Date.now()/1000);update();}await new Promise(r=>root.setTimeout(r,250));}}
function assertAccount(){if(identity()!==account)throw localizedError("The account or page changed. Run stopped.");if(!scopeAllowed(root.location.pathname,account,el('mode').value))throw localizedError("Open the correct page for {items}. The selected mode cannot run here.",{items:noun()});}
function save(item){done.add(item.kind+':'+item.id);root.localStorage.setItem(progressKey(),JSON.stringify({version:1,done:[...done]}));}
async function remove(item){
 for(let attempt=0;attempt<4&&!stopped;attempt++){
  await wait(0);if(stopped)return 'stopped';assertAccount();
  const csrf=doc.cookie.match(/(?:^|;\s*)ct0=([^;]+)/)?.[1];if(!csrf)throw localizedError("Session expired. Sign in to X again.");
  if(!itemMatchesFilter(item,el('mode').value,adultOnly()))throw localizedError("The item does not match the selected mode or filter.");
  const {operation:op,queryId,variables}=mutationFor(item);
  let response;
  stats.requests++;update();
  try{response=await root.fetch('https://x.com/i/api/graphql/'+queryId+'/'+op,{method:'POST',credentials:'include',signal:AbortSignal.timeout(30000),headers:{authorization:'Bearer '+BEARER,'x-csrf-token':csrf,'content-type':'application/json','x-twitter-auth-type':'OAuth2Session','x-twitter-active-user':'yes'},body:JSON.stringify({queryId,variables})});}
  catch(e){if(attempt===3)return 'failed';update(msg("Network error. Retrying…"));await wait(2000*2**attempt);continue;}
  const body=await response.json().catch(()=>null),result=classify(response.status,body,item.kind);
  if(result==='rate'){const ms=rateWait(response.headers.get('x-rate-limit-reset'),Date.now());waitUntil=Date.now()+ms;update(msg("X asked for a pause. The list is saved; the run resumes automatically."),'waiting');await wait(ms);waitUntil=0;if(!stopped)update(activeMessage(),'deleting');attempt--;continue;}
  if(result==='fatal')throw localizedError("X returned HTTP {status}. Session or API incompatible; no success was recorded.",{status:response.status});
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
  if(!itemMatchesFilter(item,el('mode').value,adultOnly()))throw localizedError("The list contains an item from another mode or without an adult label; run stopped.");
  attempted.add(id);stats.scanned++;
  // Interactions can be marked again. A fresh preview or live marker is eligible.
  if(interactions()&&!dry&&done.delete(id))root.localStorage.setItem(progressKey(),JSON.stringify({version:1,done:[...done]}));
  if(done.has(id)&&!interactions()){stats.skipped++;preview.delete(id);savePreview();update();continue;}
  preview.set(id,item);savePreview();
  if(dry){update(interactions()?msg("Preview: IDs saved to remove {items} without repeating the search.",{items:targetNoun()}):msg("Preview: IDs saved to delete posts without repeating the search."),'scanning');continue;}
  if(phase!=='deleting')update(activeMessage(),'deleting');
  const result=await remove(item);if(result==='ok'||result==='gone'){save(item);preview.delete(id);savePreview();result==='ok'?stats.deleted++:stats.gone++;failures.delete(id);}else if(result!=='stopped'){stats.failed++;failures.set(id,result);}
  update();await wait(800);
 }
}
async function run(){
 const cached=!dry&&preview.size>0;
 if(cached){update(msg(interactions()?'Removing {items} using saved IDs; the search then continues automatically.':'Deleting {items} using saved IDs; the search then continues automatically.',{items:targetNoun()}),'deleting');await process([...preview.values()]);}
 if(el('mode').value==='archive'){if(queue.length)await process(queue);else if(!cached)throw localizedError("Select tweets.js/tweets-part*.js files.");}
 else if(!stopped){root.scrollTo(0,0);await wait(700);let idle=0,passes=0;
  while(!stopped&&idle<12){assertAccount();const before=attempted.size;await process(visibleItems());if(stopped)break;const bottom=root.scrollY+root.innerHeight>=doc.documentElement.scrollHeight-100;idle=bottom&&attempted.size===before?idle+1:0;root.scrollBy(0,Math.round(root.innerHeight*.65));await wait(1500);if(++passes>20000)throw localizedError("Scan limit reached. Export the report and restart.");}
 }
 waitUntil=0;
 update(stopped?msg("Stopped. Found IDs and progress were saved."):dry?msg(interactions()?'{count} IDs saved. Uncheck Preview without changes to remove {items}.':'{count} IDs saved. Uncheck Preview without changes to delete and continue.',{count:preview.size,items:targetNoun()}):msg('Run complete with {failures} failures. Refresh the page to check what remains. {detail}',{failures:stats.failed,detail:interactions()?msg('Posts remain on X; only {items} were removed.',{items:targetNoun()}):msg('Older posts may need the X archive.')}),stopped?'stopped':'complete');
}
function startLabel(){el('start').textContent=el('dry').checked?t('Find {items}',{items:targetNoun()}):interactions()?t('Remove {items}',{items:targetNoun()}):t(previewSource===sourceKey()&&preview.size?'Delete and continue':'Delete available posts');el('start').className='primary'+(el('dry').checked?'':' danger');}
function sourceControls(){const mode=el('mode').value;el('file-field').hidden=mode!=='archive';el('adult-field').hidden=!interactions();el('source-link').hidden=!interactions()||scopeAllowed(root.location.pathname,account,mode);el('source-link').href='https://x.com'+(mode==='bookmarks'?'/i/bookmarks':'/i/history/likes');el('source-hint').textContent=mode==='archive'?t("The archive is read locally and never uploaded."):interactions()?t(mode==='bookmarks'?'Uses the Bookmarks page. Only bookmarks are removed; posts remain.':'Uses Likes in X History. Only likes are removed; posts remain.'):t("Searches while scrolling. Older posts may not appear.");startLabel();}
el('dry').onchange=()=>{startLabel();update(el('dry').checked?msg("Preview finds and saves IDs. No changes are sent."):interactions()?msg("You will confirm removing {items}. Posts remain on X.",{items:noun()}):msg("Deletion is permanent. You will confirm the account before starting."),'ready');};
el('mode').onchange=()=>{try{loadProgress();Object.keys(stats).forEach(k=>stats[k]=0);failures.clear();sourceControls();update(msg("Mode changed. Preview first or confirm the action to start."),'ready');}catch(e){update(e.localizedMessage||e.message,'error');}};
el('adult').onchange=()=>{try{loadProgress();Object.keys(stats).forEach(k=>stats[k]=0);failures.clear();startLabel();update(adultOnly()?msg("Filter on: only explicit X adult content warnings. Without a visible label, no changes are sent."):msg("Filter off: all found {items} are eligible.",{items:noun()}),'ready');}catch(e){update(e.localizedMessage||e.message,'error');}};
el('files').onchange=async()=>{queue=[];try{const combined=new Map();for(const file of el('files').files)for(const item of parseArchive(await file.text()))combined.set(item.id,item);queue=[...combined.values()];preview.clear();previewSource=sourceKey();savePreview();startLabel();fileMessage=msg('{count} unique IDs loaded.',{count:queue.length});el('file-info').textContent=textOf(fileMessage);update(msg("{count} unique IDs loaded locally.",{count:queue.length}),'ready');}catch(e){fileMessage=msg('Could not read the files.');el('file-info').textContent=textOf(fileMessage);update(e.localizedMessage||e.message,'error');}};
el('start').onclick=async()=>{
 if(busy)return;dry=el('dry').checked;try{assertAccount();}catch(e){update(e.localizedMessage||e.message,'error');return;}
 if(el('mode').value==='archive'&&!queue.length&&!(previewSource===sourceKey()&&preview.size)){update(msg("Select the files first."),'error');return;}
 const phrase=t(interactions()?(adultOnly()?'REMOVE {items} ADULT @{account}':'REMOVE {items} @{account}'):'DELETE @{account}',{items:noun().toUpperCase(),account});
 if(!dry&&root.prompt(t('{action} for @{account}, waiting for X rate limits? {filter}Website automation may result in suspension by X. Type {phrase} to start.',{action:interactions()?msg('Remove {items}, keeping the posts',{items:targetNoun()}):msg('Permanently delete posts'),account,filter:adultOnly()?msg('Only items with an explicit adult warning detected in the preview or page. '):'',phrase}))!==phrase)return;
 if(!root.navigator.locks){update(msg("Use an up-to-date Chrome: this browser does not support execution locks."),'error');return;}
 await root.navigator.locks.request(key,{ifAvailable:true},async lock=>{
  if(!lock){update(msg("This account already has a run in another tab."),'error');return;}
  try{done=checkpoint(root.localStorage.getItem(progressKey()));}catch(e){update(e.localizedMessage||e.message,'error');return;}
  try{if(previewSource!==sourceKey()||dry){preview.clear();previewSource=sourceKey();savePreview();}}catch(e){update(msg("Stopped: {error}",{error:e.localizedMessage||e.message}),'error');return;}
  busy=true;stopped=false;paused=false;attempted.clear();Object.keys(stats).forEach(k=>stats[k]=0);failures.clear();
  ['start','mode','files','dry','adult'].forEach(id=>el(id).disabled=true);el('pause').disabled=el('stop').disabled=false;el('pause').textContent=t("Pause");
  update(dry?msg("Finding IDs without changing X. You can stop and use the partial list."):activeMessage(),dry?'scanning':'deleting');
  try{await run();}catch(e){waitUntil=0;phase='error';message=msg("Stopped: {error}",{error:e.localizedMessage||e.message});}finally{busy=false;paused=false;['start','mode','files','dry','adult'].forEach(id=>el(id).disabled=false);el('pause').disabled=el('stop').disabled=true;startLabel();update();}
 });
};
el('pause').onclick=()=>{paused=!paused;el('pause').textContent=paused?t("Resume"):t("Pause");update();};
el('stop').onclick=()=>{stopped=true;paused=false;update(msg("Stopping after the current request…"));};
el('hide').onclick=()=>{el('panel').hidden=true;el('mini').hidden=false;el('mini').focus();};
function show(){el('panel').hidden=false;el('mini').hidden=true;host.style.display='';}
el('mini').onclick=()=>{show();el('hide').focus();};
el('report').onclick=()=>{const report={version:VERSION,account,date:new Date().toISOString(),mode:el('mode').value,filter:adultOnly()?'adult-warning':'all',simulation:dry,stats,completed:[...done],pending:[...preview.values()],failures:[...failures]};const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=doc.createElement('a');a.href=url;a.download='tweet-cleaner-report.json';a.click();root.setTimeout(()=>URL.revokeObjectURL(url),1000);};
const STATIC_COPY={"copy-0": "Free · v{version}", "copy-1": "What to clean", "copy-2": "Posts and reposts on this page", "copy-3": "Posts from your X archive", "copy-4": "Bookmarks", "copy-5": "Likes", "source-hint": "Searches while scrolling. Older posts may not appear.", "source-link": "Open the page on X ↗", "copy-8": "Post archive files", "file-info": "Select tweets.js or tweets-part*.js.", "copy-10": "Adult content only", "copy-11": "Only explicit X warnings in English or Portuguese.", "copy-12": "Without a visible adult label, the item stays untouched. “Sensitive content” alone does not qualify.", "copy-13": "Preview without changes", "preview-hint": "Saves IDs for later cleanup without repeating the search.", "copy-15": "Pending", "copy-16": "Failed", "copy-17": "Found", "copy-18": "Already absent", "copy-19": "Already processed", "stop": "Stop", "report": "Export report", "copy-22": "How it works & precautions", "copy-23": "Deleting posts is permanent. Removing likes or bookmarks only removes those interactions; the posts remain. Each mode requires your confirmation.", "copy-24": "No item cap. When X asks for a pause, the run waits and resumes automatically. Keep this tab open and your computer awake.", "copy-25": "For posts, also run on Replies and Reposts. The X archive is used only for posts. Likes and bookmarks come from their own pages.", "copy-26": "Progress for each mode stays locally on this site. Visible likes or bookmarks can be reconsidered in a new run if you marked them again; refresh the page before resuming.", "copy-27": "X also lets you clear all bookmarks from the menu on the Bookmarks page. ", "copy-28": "X instructions", "copy-29": "X may restrict automation through its website. ", "copy-30": "X automation rules"};
let fileMessage=msg('Select tweets.js or tweets-part*.js.');
function renderLanguage(){
 el('panel').lang=language;el('mini').lang=language;
 for(const [id,source] of Object.entries(STATIC_COPY))el(id).textContent=t(source,{version:VERSION});
 el('file-info').textContent=textOf(fileMessage);
 el('hide').setAttribute('aria-label',t('Minimize panel'));el('hide').title=t('Minimize');
 el('mini').setAttribute('aria-label',t('Expand Tweet Cleaner'));el('metrics').setAttribute('aria-label',t('Progress for this run'));
 el('language').textContent=language==='en'?'PT':'EN';
 el('language').setAttribute('aria-label',t(language==='en'?'Switch to Portuguese':'Switch to English'));el('language').title=el('language').getAttribute('aria-label');
 el('pause').textContent=t(paused?'Resume':'Pause');sourceControls();update();
}
function setLanguage(value,persist=true){
 languageRevision++;language=value==='pt-BR'?'pt-BR':'en';renderLanguage();
 if(persist){try{if(extensionStorage)extensionStorage.local.set({[LANGUAGE_KEY]:language}).catch(()=>root.alert(t('Could not save the language preference.')));else root.localStorage.setItem(LANGUAGE_KEY,language);}catch{root.alert(t('Could not save the language preference.'));}}
}
el('language').onclick=()=>setLanguage(language==='en'?'pt-BR':'en');
root.TweetCleaner={version:VERSION,show,setLanguage,get language(){return language;},stop:()=>{stopped=true;paused=false;}};renderLanguage();
if(extensionStorage){extensionStorage.local.get(LANGUAGE_KEY).then(saved=>{if(!languageRevision&&saved[LANGUAGE_KEY])setLanguage(saved[LANGUAGE_KEY],false);}).catch(()=>{});extensionStorage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes[LANGUAGE_KEY])setLanguage(changes[LANGUAGE_KEY].newValue,false);});}
return {opened:true,version:VERSION};
})(typeof window==='undefined'?{}:window);
