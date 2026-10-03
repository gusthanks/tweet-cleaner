const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'delete-tweets.js'), 'utf8');
fs.writeFileSync(path.join(root, 'tweetdelete.user.js'), `// ==UserScript==
// @name         Tweet Cleaner
// @namespace    https://github.com/gusthanks/tweet-cleaner
// @version      2.0.0
// @description  Limpeza com simulação, retomada e confirmação explícita.
// @match        https://x.com/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// ==/UserScript==
GM_registerMenuCommand('Abrir Tweet Cleaner', () => {
${script}
});`);
