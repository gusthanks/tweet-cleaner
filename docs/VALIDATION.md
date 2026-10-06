# Version 3.2.0 validation

October 6, 2026:

- 78 automated tests passed with synthetic DOM/network responses. Existing cleanup regressions remain covered, including more than 500 actions, rate-limit retry, account changes, shared locks, pending cache and adult-filter isolation.
- English is the default in the panel/popup. PT/EN translates current status, errors, counts and confirmations, remembers the choice and shares the preference across extension contexts. No mutation starts from changing language.
- Switching during a rate wait/pause retains the same pending ID and resumes it. Filtered lists, current mode and counters survive language changes/reload. Locale-specific confirmation rejects a phrase from the other language. English/Portuguese catalog placeholders and generated copies match.
- The local demo preview found one explicit adult-warning item, saved one pending ID and sent zero mutation calls. Switching to English preserved the list and counters.
- Desktop UI was checked at an actual content viewport of 1280×720. A browser viewport override did not apply, so small-window checks used the bundled engine inside a 360×760 iframe fixture (345 px document width after the scrollbar). The panel measured 328 px wide with no horizontal overflow. Its buttons were at least 44 px high; the longer Portuguese action wrapped to two lines. Both languages were checked in the popup/panel.
- Source, console, userscript and unpacked extension share version 3.2.0. The ZIP is `dist/tweet-cleaner-3.2.0.zip`; only known runtime files and the license are included. Demo fixtures, tests, personal archives and reports are excluded.
- Live installation/reload in Chrome and real X mutations were not performed for this release. Internal endpoints, markers and adult-warning detection still require validation on a disposable X test account. No store submission, registration payment or policy hosting was performed.

## Earlier validation: 3.1.1

October 5, 2026:

- 64 synthetic tests passed. `/i/history/likes`, confirmed in the user's screenshot, works in popup/engine and selects Likes automatically.
- Filtered preview sends no changes; synthetic removal uses only `UnfavoriteTweet`. Post mode remains blocked on Likes pages.
- Old filtered Likes previews are reusable before scrolling. Account changes stop the run and preserve pending IDs; general/filtered lists stay separate.
- Console/userscript/extension use the same engine. The package was `dist/tweet-cleaner-3.1.1.zip`.
- No real like removal or Chrome installation/reload occurred for that fix. The page route was confirmed by the user's screenshot; warning detection/mutations still needed live validation.

## Earlier validation: 3.1.0

October 5, 2026:

- 59 synthetic tests passed, covering preview/reusable cache, large runs, authorization, account changes, locks, authentication errors, ambiguous responses, storage failures, HTTP 429, pause and stop.
- Likes/bookmarks use only their own operations, including on the user's own posts. Wrong page/phrase/type sends no request. Histories/previews are independent, and re-marked interactions remain eligible.
- The adult filter requires explicit English/Portuguese media warnings; generic notices, post text, quoted content and warnings without a Show control do not qualify. General cache cannot enter the filter; missing adult evidence is rejected. The filter is locked during execution and the phrase includes ADULTOS.
- The synthetic demo found three general likes or one filtered like with zero mutations during preview. One filtered synthetic removal then succeeded. There was no adult media and no request to X.
- Layout was inspected at 1280×800 and 360×760, including filtered Likes/Bookmarks. Panel width stays within the window, with internal scrolling for limited height. Measured controls had 44 px targets, associated labels and visible focus.
- Console/userscript/extension share one engine; test/demo/archive/report files are excluded from distribution.
- Live X operations and adult warning detection were not validated. Hidden/unrecognized warnings are preserved, and tests do not prove full-history coverage. Store publication/payment/policy hosting were not performed.

## Local artifacts

- `dist/tweet-cleaner-3.2.0.zip`: distribution package.
- `dist/tweet-cleaner/`: unpacked extension folder.
- `artifacts/store/panel-en-3.2.0.png`: English panel with identified synthetic data.
- `artifacts/store/promo-440x280.png`: original promotional image.
- `extension/icons/128.png`: store icon.

These checks do not guarantee Chrome Web Store approval or future compatibility with X's internal endpoints.
