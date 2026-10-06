# Tweet Cleaner

Free Chrome extension to clean X posts, replies, reposts, bookmarks and likes. Preview, pause and resume with locally saved progress. **English by default, with a one-click Portuguese switch.** No ads, subscriptions or commercial item cap.

Derived from [backzso/tweetdelete](https://github.com/backzso/tweetdelete), under the MIT license. Independent tool, not affiliated with X or Google.

## Install in Chrome

1. Build with `npm run build`, or use an already extracted package.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select `dist/tweet-cleaner`, the folder containing `manifest.json`.
4. Pin the extension. Open your own profile, **History → Likes** (`/i/history/likes`) or the main Bookmarks page on X.
5. Click the extension icon, then **Open panel in this tab**.

The ZIP is for store submission; local installation uses the extracted folder. Installing the extension or opening the panel never starts cleanup.

## Choose your language

Click **PT** in the popup or panel to switch to Portuguese; click **EN** to return to English. Labels, status, errors, counters and confirmation prompts follow your choice. Switching language preserves the current mode, filter, pending IDs and running state.

The extension saves this preference locally in Chrome and shares it between popup and panel. The console/userscript version stores its preference on X. No online translation service or browser sync is used. Language selection changes the tool's interface, not X itself or browser-native file dialogs.

## Use the panel

1. Under **What to clean**, choose page posts/reposts, archive posts, bookmarks or likes. Opening on Likes or Bookmarks selects the corresponding mode automatically.
2. **Preview without changes** starts checked. Click **Find posts**, **Find bookmarks** or **Find likes** to save IDs without changing X. You can **Stop** early and keep a partial list.
3. Uncheck preview and click **Delete and continue**, **Remove bookmarks** or **Remove likes**. Type the confirmation phrase for the action and signed-in account. The run processes saved IDs first, then continues searching. Without a saved list, it searches and processes directly.
4. Keep the tab open and your computer awake. **Pause**, **Resume** and **Stop** also work while waiting for X. An in-flight request may finish after you stop.
5. Minimize the panel to keep a compact status control; click it to reopen.
6. Export a report if needed. Refresh the page after completion to check what remains. For posts, also run on **Replies** and **Reposts**. Switching pages is manual.

Main counters describe the current run; **saved actions** is the accumulated local history. There is no completion percentage because the page does not expose the full accessible total. A run with no new IDs does not prove that the entire history was removed.

There is no 500-item cap. Requests are sequential, with at least 800 ms between items, plus network, scrolling and waiting time. HTTP 429 shows a countdown, waits for X's reset time (or 15 minutes when absent) and retries the same ID. This respects rate limits; it does not guarantee that X will allow the automation.

## Bookmarks and likes

Open **Bookmarks** (`/i/bookmarks`) or **History → Likes** (`/i/history/likes`). The old own-profile route (`/your_handle/likes`) is also accepted. These modes remove interactions and **keep the underlying posts**, including your own posts. The panel checks account, page and operation type before each request. Bookmark folders are not supported; use the main page.

English confirmation phrases are `REMOVE BOOKMARKS @your_account` and `REMOVE LIKES @your_account`. In Portuguese they begin with `REMOVER`. The post-deletion phrase cannot authorize these operations. Preview, pending IDs and history are separate for each mode; a post list is never used to remove likes or bookmarks.

If you like or bookmark a previously processed post again, it can be reconsidered in a new run. Refresh the page before resuming to update markers. Post archives are not used for likes or bookmarks. Discovery depends on what X loads and may miss older items.

X also provides a native action to clear all bookmarks from the main page's three-dot menu. See [X's bookmark instructions](https://help.x.com/en/using-x/bookmarks). The extension offers preview and per-item tracking.

### Adult content only

In **Likes** or **Bookmarks**, optionally check **Adult content only** before starting. The filter is off by default. Only an explicit X media warning titled **Content warning: Adult Content** or **Aviso de conteúdo: Conteúdo adulto**, associated with a Show/Mostrar control, qualifies. The tool never opens media, analyzes images or sends content to AI.

Generic sensitive-content, violence or nudity notices, account names, post text and warnings inside quoted posts do not qualify. Without a recognized adult warning, the item stays untouched. If your settings show media without warnings, the filter cannot discover those items. X's labels may be wrong; this filter follows the displayed label, as described in [X's adult content policy](https://help.x.com/en/rules-and-policies/adult-content).

Preview with the filter enabled. The filtered list is separate from the general list and records only ID, operation and a local adult-warning flag. A general saved list cannot be used for filtered removal. Uncheck preview and confirm `REMOVE LIKES ADULT @your_account` or `REMOVE BOOKMARKS ADULT @your_account` (Portuguese: `REMOVER … ADULTOS`). After reloading, reselect the filter to restore filtered pending IDs. The filter is locked during a run and does not apply to deleting posts.

## Local archives and resume

Select `data/tweets.js` or split `tweets-part*.js` files from your X export. Multiple files are deduplicated. Files are parsed as JSON, never executed or uploaded to the developer. All entries, including replies and reposts, are handled by their export IDs. Remaining reposts may need a separate run on Reposts.

An archive is a snapshot: newer posts need another run. Page mode scrolls incrementally and may not reach older posts X omits.

Completed and pending IDs live in X's `localStorage`, separated by account and cleanup mode. No post text or authentication tokens are stored there. Reload and reopen the panel to resume. Failures remain pending; successfully deleted posts are skipped. Likes/bookmarks can be reconsidered if marked again. Starting a new preview or selecting new files replaces the pending list for that source. Lists are not synchronized across browsers.

A shared lock prevents concurrent runs for the same account and origin, even across modes. The Profile link must identify the signed-in account; each action rechecks its page. No personal handle is hardcoded in source or configuration.

To update: stop the old run and wait for it to finish, reload the extension in `chrome://extensions`, then refresh the X tab. Check **v3.2.0** in the panel. Existing post progress from 2.1/2.2/3.0 remains compatible on the same origin and browser profile. Likes/bookmarks retain separate histories. Old Likes previews are reusable across the legacy and History routes, preserving general/adult-filter separation.

## Privacy and compatibility

- Deleting posts is permanent and requires confirmation. Preview discovers IDs; it does not test the deletion API.
- X warns that website scripting may result in account suspension. Read [X's automation rules](https://help.x.com/en/rules-and-policies/x-automation).
- Internal X endpoints may change without notice. The earlier console script has been used, but **the extension still needs live validation on a test account**. Automated checks and the demo use synthetic DOM/network responses.
- HTTP 401/403/404 stops the run. Ambiguous responses never count as confirmed success. Network/server retries are bounded, with increasing delays.
- Recent Chrome is required. Cleanup does not run with the tab closed.
- Messages, followers and profile data are not removed.
- Reports contain account, IDs, counts, filter and failures; filtered pending items include the adult-warning flag. No post text or cookies are included. Do not publish reports, X data or credentials.

Read the [English privacy policy](extension/privacy.html) or [Portuguese policy](extension/privacy-pt.html). There is no developer collection server. Uninstalling removes the extension's language preference, but does not clear X progress storage or undo actions.

## Chrome Web Store

The [installation and publication guide](docs/CHROME-WEB-STORE.md) covers developer registration, Google's one-time fee, ZIP upload, images, privacy and review. The [prepared listing](docs/STORE-LISTING.md) includes English copy and permission justifications. Publisher details, a public policy URL and live validation must be completed before submission. Publication is a separate, manual step.

[CHROMEWEBSTORE.md](CHROMEWEBSTORE.md) summarizes purpose, permissions and preparation status, following Google's guidance for AI-assisted extension projects.

## Console and userscript

`delete-tweets.js` remains self-contained. Copy the **entire file**, not a diff, into the Console on your own profile, Likes or Bookmarks page. A compatible userscript manager can open `tweetdelete.user.js` through **Open Tweet Cleaner**.

The console version opens once per page load. Use `TweetCleaner.show()` to reopen or `TweetCleaner.stop()` to stop. Stop and reload before changing versions. Do not run an older console script alongside the new extension.

## Development

```sh
npm run build
npm test
npm run package
node --check delete-tweets.js
```

No external build dependencies. `npm run build` works with Node.js and generates the console script, userscript and `dist/tweet-cleaner`. ZIP packaging through `npm run package` currently requires Windows PowerShell. The ZIP includes only runtime files and the license. Manifest V3 permissions: `activeTab` for temporary access, `scripting` for bundled injection and `storage` for the language preference. No permanent host access, remote code, analytics or sync.

English is the source language; [locales/pt-BR.json](locales/pt-BR.json) holds Portuguese translations. Build embeds them so console mode needs no extra files. See [localization notes](docs/LANGUAGES.md).

Generate original icons/promo art with `python scripts/assets.py` (Pillow required). Generate the synthetic demo with `node scripts/preview.cjs`, then serve `artifacts/preview` locally. It never sends requests to X and is excluded from the ZIP. Tests cover parsing, IDs, hosts, explicit success, errors, preview/resume, account guards, rate limits, UI state, popup and localization. They do not replace live validation.

## Origin

Base: `backzso/tweetdelete`, commit `b824c2a76f21aaf06acc2a3e735be98fc0bf831d`, with original Git history and MIT license preserved. Instructions from [oli-dev0/tweet-clear](https://github.com/oli-dev0/tweet-clear) and [kylesnav/x-deleter](https://github.com/kylesnav/x-deleter) were research references; no code from those projects was copied. See [research notes](RESEARCH.md) and [changes](CHANGELOG.md).

## Português

O Tweet Cleaner é gratuito e limpa posts, respostas, reposts, likes e bookmarks do X. Começa em inglês: clique **PT** no popup ou painel para usar português; **EN** volta ao inglês. Sua escolha fica salva no navegador, e trocar o idioma preserva a execução e os IDs encontrados.

Para instalar, gere o pacote com `npm run package`, abra `chrome://extensions`, ative **Modo do desenvolvedor** e use **Carregar sem compactação** na pasta `dist/tweet-cleaner`. Pare a versão antiga, recarregue a extensão e atualize a aba do X para usar **v3.2.0**. O painel começa em **Prévia sem apagar**; desmarque e confirme a ação quando quiser executar. Excluir posts é permanente; remover likes/bookmarks preserva os posts. O filtro adulto usa somente avisos explícitos do X, não análise por IA. Leia a [política em português](extension/privacy-pt.html).
