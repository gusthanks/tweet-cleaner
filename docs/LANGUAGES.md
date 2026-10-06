# Localization

English is the source language and default interface, regardless of browser language. Portuguese (`pt-BR`) is an explicit user choice. PT/EN controls in the popup and panel remember the preference without changing cleanup state.

## Where copy lives

- `delete-tweets.js`: English panel templates, message descriptors and confirmation phrases.
- `extension/popup.js` and `popup.html`: English popup source copy.
- `locales/pt-BR.json`: shared English-template → Portuguese dictionary.
- `extension/privacy.html` and `privacy-pt.html`: full policy in each language, linked from the popup.

Run `npm run build` after changing translations. Build embeds the catalog in the console engine and generates `extension/messages.js`, the userscript and unpacked extension. Do not edit generated catalogs by hand. No network request is needed for translations.

## Message rules

Preserve named placeholders such as `{account}`, `{count}` and `{items}` in every translation. Use message descriptors for status or errors that must re-render during a run. Render UI text through `textContent`; translations must not introduce HTML. Numbers follow `en-US`/`pt-BR`. Counts distinguish singular requests/saved actions. Typed confirmation uses the currently selected language and must match exactly; translating the UI cannot authorize an action.

Account handles, IDs, internal operation names and report JSON keys are not translated. English/Portuguese X media warnings qualify independently of the extension language. Browser-native file dialogs follow browser settings.

## Preference storage

The extension uses `chrome.storage.local` under `tweet-cleaner:language`, with `storage.onChanged` updating popup/panel. The popup passes its choice into the isolated world before injecting the engine. Console/userscript uses X `localStorage` instead. Neither path uses Chrome sync. Existing cleanup keys/checkpoint schemas stay unchanged. A late preference read cannot override a newer user choice.

## Verification

Run `npm run build` and `npm test`. Tests cover English defaults, remembered choices, shared extension preference, translated confirmations/errors, switching while waiting/paused, preserved pending IDs/counters and catalog placeholders. Inspect both languages at desktop/mobile sizes; longer text must wrap without horizontal overflow.
