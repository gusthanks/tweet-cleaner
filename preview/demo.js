'use strict';
let rateNext = false;
let calls = 0;
document.getElementById('rate').onclick = () => { rateNext = true; };
document.cookie = 'ct0=DEMO_ONLY; path=/; SameSite=Strict';
window.TweetCleanerDemoRoot = {
  document,
  location: {hostname: 'x.com', pathname: '/sample_user'},
  localStorage,
  navigator,
  innerHeight: window.innerHeight,
  scrollY: 0,
  scrollTo() {},
  scrollBy() {},
  setTimeout: window.setTimeout.bind(window),
  alert: window.alert.bind(window),
  // Auto-confirm only this synthetic environment; the shipped engine still asks.
  prompt() { return 'EXCLUIR @sample_user'; },
  async fetch(url, options) {
    // This function never calls window.fetch: all mutations are synthetic.
    calls++;
    document.getElementById('request-count').textContent = calls + ' chamadas simuladas';
    if (rateNext) {rateNext = false;return {status: 429, headers: {get: () => String(Math.ceil(Date.now()/1000) + 15)}, json: async () => ({errors: []})};}
    return {status: 200, headers: {get: () => null}, json: async () => ({data: {[url.endsWith('DeleteRetweet') ? 'unretweet' : 'delete_tweet']: {}}})};
  }
};
