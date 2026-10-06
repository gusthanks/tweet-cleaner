# Changelog

## 3.2.0

- English-first repository, README, store copy and developer documentation, with a short Portuguese explanation at the end of the README.
- English by default in popup, panel and standalone script. PT/EN buttons translate labels, status, errors, counters and typed confirmations without resetting the run or pending IDs.
- Local language preference shared between extension popup/panel using the `storage` permission; console/userscript uses X site storage. No online translation or sync.
- Shared Portuguese catalog embedded at build time. English and Portuguese privacy policies explain preference storage.
- Existing progress/cache format, account guards, adult-warning detection and cleanup behavior remain compatible.

## 3.1.1

- Accept `/i/history/likes`, confirmed in the user's screenshot, and automatically select Likes.
- Popup, per-request scope validation and page link support History Likes; the old own-profile route remains compatible.
- Reuse previews across old/new Likes routes for the same account, without mixing general and adult-filtered lists.
- Preserve action-specific confirmation, account-change protection and the ban on deleting posts from Likes pages.
- 64 tests passed with synthetic DOM/network responses, including filtered preview and account-change interruption.

## 3.1.0

- Separate bookmarks/likes removal modes that preserve posts, automatically selected from the open page.
- Independent confirmations, previews and histories. No extra extension permissions in that release.
- Verify page, markers and operation types; interaction lists never trigger post deletion.
- Re-marked likes/bookmarks remain eligible in later runs; failures stay pending.
- Optional adult-only filter based on explicit English/Portuguese X media warnings. Generic warnings, post text and quoted content do not qualify.
- Independent filtered lists, specific confirmation and locked filter during a run; preserve items without a recognized adult warning.
- Retain pause/stop, sequential requests, HTTP 429 waiting and the shared account lock.
- Help includes X's native clear-all bookmarks action and update instructions.
- Store/privacy documentation and CHROMEWEBSTORE.md preparation index.
- 59 synthetic tests passed. New operations and warning detection still needed live validation.

## 3.0.0

- Free Manifest V3 extension with temporary tab access, opened by user action.
- Clear source labels, separate counters, collapsible help, visible focus and small-window layout.
- Preview, deletion, waiting, pause, stop, error and completion states; real HTTP 429 countdown.
- Fix stale simulation copy during deletion and the saved-action counter.
- Minimize retains a control to reopen and track progress.
- Remove hardcoded personal account references from source, examples, tests and distributed metadata.
- Privacy policy, publishing guide, listing copy, original icons and ZIP package.
- Continuous execution with no 500-item cap; 2.1/2.2 progress remains compatible.
- Synthetic regression and popup tests do not delete real posts.

## 2.2.0

- Remove the 500-item/request cap at the user's request.
- Retain automatic HTTP 429 waiting without bypassing X's limits.
- Process saved IDs first, then continue discovering page items automatically.
- Preserve 2.1 progress/pending IDs, pause/stop, account guards and authentication failure stops.
- Test more than 500 deletions/retries per run and continuation after a partial preview.

## 2.1.0

- Cap each run at 500 items/requests, including retries.
- Stop simulation at 500 IDs and persist pending IDs; an early stop also keeps them.
- Delete saved batches without repeating the scan; cache survives reload and is scoped to account/page/mode.
- Failures stay pending; successes leave the list; the next batch requires manual start.
- Explicit warning about account suspension from website automation.
- Tests for large input, retry ceiling, reload and partial interruption.

## 2.0.0

- Portuguese panel with simulation, account confirmation, pause/stop and reports.
- Resume by completed IDs, separated by account/action; split archives and deduplication.
- Parse archives without executing code and keep string IDs to preserve precision.
- Execution lock and mandatory account identification.
- HTTP 404 is fatal, not automatically an absent post. Missing/ambiguous JSON is never success.
- Wait for the full rate reset; bound network/server retries; stop on authentication/API errors.
- Manually started userscript generated from the same engine; synthetic logic/runner tests.

Live X compatibility remains unverified for the extension. Page mode may miss old posts X does not load.
