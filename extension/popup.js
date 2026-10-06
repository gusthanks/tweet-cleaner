'use strict';
const LANGUAGE_KEY = 'tweet-cleaner:language';
const el = id => document.getElementById(id);
const openButton = el('open');
const status = el('status');
let language = 'en';
let statusMessage = 'The extension only accesses the tab when you open the panel.';
const copy = {tagline:'Free. In your browser.',heading:'Your history, under your control.',intro:'Delete posts and reposts, or remove bookmarks and likes, with a panel inside X.',step1:'Open your profile, Likes or Bookmarks on X.',step2:'Open the panel below and choose what to clean.',step3:'Preview first, or confirm the action.',open:'Open panel in this tab','open-x':'Open X ↗',privacy:'Privacy'};
function t(message) {
  const source = message?.source || message;
  const text = language === 'pt-BR' ? (TweetCleanerPortuguese[source] || source) : source;
  return text.replace(/\{(\w+)\}/g, (_, name) => {
    const value = message.values?.[name];
    return value?.source ? t(value) : String(value ?? '{' + name + '}');
  });
}
function renderLanguage() {
  document.documentElement.lang = language;
  for (const [id, source] of Object.entries(copy)) el(id).textContent = t(source);
  el('language').textContent = language === 'en' ? 'PT' : 'EN';
  el('language').title = t(language === 'en' ? 'Switch to Portuguese' : 'Switch to English');
  el('language').setAttribute('aria-label', el('language').title);
  el('privacy').href = language === 'en' ? 'privacy.html' : 'privacy-pt.html';
  status.textContent = t(statusMessage);
}
const ready = chrome.storage.local.get(LANGUAGE_KEY).then(saved => {
  language = saved[LANGUAGE_KEY] === 'pt-BR' ? 'pt-BR' : 'en';renderLanguage();
}).catch(() => renderLanguage());
renderLanguage();
el('version').textContent = 'v' + chrome.runtime.getManifest().version;
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes[LANGUAGE_KEY]) {language = changes[LANGUAGE_KEY].newValue === 'pt-BR' ? 'pt-BR' : 'en';renderLanguage();}
});
el('language').onclick = async () => {
  await ready;language = language === 'en' ? 'pt-BR' : 'en';renderLanguage();
  try { await chrome.storage.local.set({[LANGUAGE_KEY]: language}); }
  catch { statusMessage = 'Could not save the language preference.';status.dataset.error = 'true';renderLanguage(); }
};
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
  await ready;
  status.dataset.error = 'false';statusMessage = 'Opening the panel…';renderLanguage();
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab?.id || !isSupportedUrl(tab.url)) throw Error('Open your profile, Likes or Bookmarks on X, wait for it to load, and try again.');
    // Set the preference in the isolated world before opening the bundled engine.
    await chrome.scripting.executeScript({target:{tabId:tab.id},world:'ISOLATED',func:value=>{window.TweetCleanerInitialLanguage=value;},args:[language]});
    const results = await chrome.scripting.executeScript({target:{tabId:tab.id},files:['cleaner.js'],world:'ISOLATED'});
    const result = results[0]?.result;
    if (!result?.opened) throw Object.assign(Error(result?.error || 'Could not identify the account. Refresh the page and try again.'),{localizedMessage:result?.errorMessage});
    statusMessage = 'Panel open on X. No changes start without your confirmation.';
  } catch (error) {status.dataset.error = 'true';statusMessage = error.localizedMessage || error.message || 'Could not open the panel. Refresh the tab and try again.';}
  finally {openButton.disabled = false;renderLanguage();}
};
