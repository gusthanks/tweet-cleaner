'use strict';
let rateNext = false;
let calls = 0;
const demoMode = new URLSearchParams(window.location.search).get('mode');
const demoPath = demoMode === 'likes' ? '/sample_user/likes' : demoMode === 'bookmarks' ? '/i/bookmarks' : '/sample_user';
if (['likes', 'bookmarks'].includes(demoMode)) {
  for (const article of document.querySelectorAll('article[data-testid="tweet"]')) {
    const marker = document.createElement('button');
    marker.dataset.testid = demoMode === 'likes' ? 'unlike' : 'removeBookmark';
    marker.hidden = true;
    article.appendChild(marker);
  }
  const warning = document.createElement('div');
  warning.className = 'demo-warning';
  const title = document.createElement('span');title.textContent = 'Content warning: Adult Content';
  const note = document.createElement('small');note.textContent = 'Aviso fictício para testar o filtro. Não há mídia adulta.';
  const show = document.createElement('button');show.textContent = 'Show';show.disabled = true;
  warning.append(title, note, show);
  document.querySelector('article[data-testid="tweet"]').appendChild(warning);
}
document.getElementById('rate').onclick = () => { rateNext = true; };
document.cookie = 'ct0=DEMO_ONLY; path=/; SameSite=Strict';
window.TweetCleanerDemoRoot = {
  document,
  location: {hostname: 'x.com', pathname: demoPath},
  localStorage,
  navigator,
  innerHeight: window.innerHeight,
  scrollY: 0,
  scrollTo() {},
  scrollBy() {},
  setTimeout: window.setTimeout.bind(window),
  alert: window.alert.bind(window),
  // Auto-confirm only this synthetic environment; the shipped engine still asks.
  prompt() { const adult = document.querySelector('#tweet-cleaner-panel')?.shadowRoot?.getElementById('adult').checked;return (demoMode === 'likes' ? 'REMOVER LIKES' : demoMode === 'bookmarks' ? 'REMOVER BOOKMARKS' : 'EXCLUIR') + (adult && ['likes','bookmarks'].includes(demoMode) ? ' ADULTOS' : '') + ' @sample_user'; },
  async fetch(url, options) {
    // This function never calls window.fetch: all mutations are synthetic.
    calls++;
    document.getElementById('request-count').textContent = calls + ' chamadas simuladas';
    if (rateNext) {rateNext = false;return {status: 429, headers: {get: () => String(Math.ceil(Date.now()/1000) + 15)}, json: async () => ({errors: []})};}
    const result = url.endsWith('DeleteBookmark') ? {tweet_bookmark_delete: 'Done'} : url.endsWith('UnfavoriteTweet') ? {unfavorite_tweet: 'Done'} : {[url.endsWith('DeleteRetweet') ? 'unretweet' : 'delete_tweet']: {}};
    return {status: 200, headers: {get: () => null}, json: async () => ({data: result})};
  }
};
