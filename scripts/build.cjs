const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const version = require('../package.json').version;
const script = fs.readFileSync(path.join(root, 'delete-tweets.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'extension/manifest.json'), 'utf8'));
if (manifest.version !== version || !script.includes(`const VERSION='${version}'`)) throw Error('Versões divergentes.');
fs.writeFileSync(path.join(root, 'tweetdelete.user.js'), `// ==UserScript==
// @name         Tweet Cleaner
// @namespace    urn:tweet-cleaner
// @version      ${version}
// @description  Limpeza com prévia, retomada e confirmação explícita.
// @match        https://x.com/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// ==/UserScript==
GM_registerMenuCommand('Abrir Tweet Cleaner', () => {
${script}
});`);
const output = path.join(root, 'dist', 'tweet-cleaner');
// Copy only known runtime files; archives, tests and reports never enter the ZIP.
fs.mkdirSync(path.join(output, 'icons'), {recursive: true});
for (const name of ['manifest.json', 'popup.html', 'popup.css', 'popup.js', 'privacy.html']) {
  fs.copyFileSync(path.join(root, 'extension', name), path.join(output, name));
}
for (const size of [16, 32, 48, 128]) fs.copyFileSync(path.join(root, 'extension', 'icons', `${size}.png`), path.join(output, 'icons', `${size}.png`));
fs.copyFileSync(path.join(root, 'LICENSE'), path.join(output, 'LICENSE'));
fs.writeFileSync(path.join(output, 'cleaner.js'), script);
console.log(`Tweet Cleaner ${version}: userscript e extensão gerados.`);
