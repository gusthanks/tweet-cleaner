const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const version = require('../package.json').version;
const portuguese = JSON.parse(fs.readFileSync(path.join(root, 'locales/pt-BR.json'), 'utf8'));
let script = fs.readFileSync(path.join(root, 'delete-tweets.js'), 'utf8');
script = script.replace(/\/\/ BEGIN TRANSLATIONS[\s\S]*?\/\/ END TRANSLATIONS/, `// BEGIN TRANSLATIONS (generated from locales/pt-BR.json)\nconst PORTUGUESE=${JSON.stringify(portuguese)};\n// END TRANSLATIONS`);
fs.writeFileSync(path.join(root, 'delete-tweets.js'), script);
fs.writeFileSync(path.join(root, 'extension/messages.js'), `// Generated from locales/pt-BR.json by npm run build.\nconst TweetCleanerPortuguese=${JSON.stringify(portuguese)};\n`);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'extension/manifest.json'), 'utf8'));
if (manifest.version !== version || !script.includes(`const VERSION='${version}'`)) throw Error('Version mismatch.');
fs.writeFileSync(path.join(root, 'tweetdelete.user.js'), `// ==UserScript==
// @name         Tweet Cleaner
// @namespace    urn:tweet-cleaner
// @version      ${version}
// @description  Cleanup with preview, resume and explicit confirmation. English and Portuguese.
// @match        https://x.com/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// ==/UserScript==
GM_registerMenuCommand('Open Tweet Cleaner', () => {
${script}
});`);
const output = path.join(root, 'dist', 'tweet-cleaner');
// Copy only known runtime files; archives, tests and reports never enter the ZIP.
fs.mkdirSync(path.join(output, 'icons'), {recursive: true});
for (const name of ['manifest.json', 'popup.html', 'popup.css', 'popup.js', 'messages.js', 'privacy.html', 'privacy-pt.html']) {
  fs.copyFileSync(path.join(root, 'extension', name), path.join(output, name));
}
for (const size of [16, 32, 48, 128]) fs.copyFileSync(path.join(root, 'extension', 'icons', `${size}.png`), path.join(output, 'icons', `${size}.png`));
fs.copyFileSync(path.join(root, 'LICENSE'), path.join(output, 'LICENSE'));
fs.writeFileSync(path.join(output, 'cleaner.js'), script);
console.log(`Tweet Cleaner ${version}: userscript and extension built.`);
