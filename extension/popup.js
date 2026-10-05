'use strict';
const openButton = document.getElementById('open');
const status = document.getElementById('status');
document.getElementById('version').textContent = 'v' + chrome.runtime.getManifest().version;

function isSupportedUrl(value) {
  try {
    const url = new URL(value);
    const reserved = new Set(['home', 'explore', 'notifications', 'messages', 'settings', 'i', 'search', 'compose', 'login', 'logout']);
    const match = /^\/([A-Za-z0-9_]+)(?:\/(with_replies|retweets|reposts|media|likes))?\/?$/.exec(url.pathname);
    const supported = /^\/i\/(?:bookmarks|history\/likes)\/?$/.test(url.pathname) || (match && !reserved.has(match[1].toLowerCase()));
    return url.protocol === 'https:' && ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(url.hostname) && supported;
  } catch { return false; }
}

openButton.onclick = async () => {
  openButton.disabled = true;
  status.dataset.error = 'false';
  status.textContent = 'Abrindo o painel…';
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab?.id || !isSupportedUrl(tab.url)) throw Error('Abra seu perfil, Likes ou Bookmarks no X, aguarde carregar e tente novamente.');
    const results = await chrome.scripting.executeScript({
      target: {tabId: tab.id}, files: ['cleaner.js'], world: 'ISOLATED'
    });
    const result = results[0]?.result;
    if (!result?.opened) throw Error(result?.error || 'Não foi possível identificar a conta. Atualize a página e tente novamente.');
    status.textContent = 'Painel aberto no X. Nenhuma ação começa sem sua confirmação.';
  } catch (error) {
    status.dataset.error = 'true';
    status.textContent = error.message || 'Não foi possível abrir o painel. Atualize a aba e tente novamente.';
  } finally { openButton.disabled = false; }
};
