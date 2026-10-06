# Install and publish the extension

## Free local installation

1. Run `npm run build`, or use a ready extracted `dist/tweet-cleaner` folder. ZIP packaging with `npm run package` currently requires Windows PowerShell.
2. Open `chrome://extensions` in Chrome and enable **Developer mode**.
3. Click **Load unpacked** and select the folder containing `manifest.json`, not the ZIP.
4. Pin Tweet Cleaner. Open your own profile, **History → Likes** (`/i/history/likes`) or main Bookmarks page on X.
5. Click the extension icon and **Open panel in this tab**. Click **PT** for Portuguese if preferred.

No deletion starts automatically. Closing the popup does not stop the panel; closing the X tab does. Keep the installed folder in place.

Before updating, stop the old run and wait for it to finish. Reload the extension in `chrome://extensions`, then refresh X to remove the old panel. Confirm **v3.2.0**. Existing post progress is compatible on the same origin/profile; likes/bookmarks have separate histories. PT/EN remembers your choice locally.

## Publish for other users

The extension can be free for users. Google requires developer registration and a **one-time registration fee**; check the amount displayed before paying. This project does not automatically publish or pay.

1. Open the [Developer Dashboard](https://chrome.google.com/webstore/devconsole), register and configure the publisher using [Google's registration guide](https://developer.chrome.com/docs/webstore/register).
2. Test the local extension using a disposable X account you control. Synthetic tests do not guarantee compatibility with live internal endpoints.
3. Host `extension/privacy.html` and `privacy-pt.html` at public HTTPS URLs, keeping the relative language links. A policy inside the ZIP does not replace the public URL required by the listing. Hosting requires a separate step.
4. Click **New item** and upload `dist/tweet-cleaner-3.2.0.zip`. The manifest belongs at the ZIP root. Do not zip the entire repository.
5. Fill **Store listing** from [STORE-LISTING.md](STORE-LISTING.md), using English as the primary language. Use `extension/icons/128.png`, at least one 1280×800 or 640×400 screenshot, and a 440×280 small promotional image. Images must represent the actual experience. Project demo captures identify their synthetic data.
6. In **Privacy**, state the single purpose and justify all three permissions. Accurately disclose local account/page/ID/interaction processing and session authentication sent directly to X. `storage` saves only the language preference. Do not claim authentication is unused: the engine reads the CSRF token for the existing session.
7. Under **Distribution**, choose free distribution and desired visibility. Complete test instructions without supplying personal credentials or cookies.
8. Review and click **Submit for review**. Deferred publishing lets you choose when to make it available after approval.

Google may request changes or reject a submission. Manifest V3 and limited permissions do not guarantee approval. Internal X endpoints and X automation rules remain relevant; do not promise that the account cannot be restricted.

## Required before submission

- Public publisher name: `[DADO A CONFIRMAR]`.
- Support email or public URL: `[DADO A CONFIRMAR]`.
- Public HTTPS privacy-policy URL: `[DADO A CONFIRMAR]`.
- Category/distribution countries: `[DADO A CONFIRMAR]`.
- Live extension validation on an X test account: `[DADO A CONFIRMAR]`.

The marker means information still needs confirmation. No personal handle replaces missing publisher details in the package.

## Official references

- [Load an unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
- [Publication and review](https://developer.chrome.com/docs/webstore/publish).
- [Listing images](https://developer.chrome.com/docs/webstore/best-listing).
- [Privacy declarations](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy).
- [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) and [storage](https://developer.chrome.com/docs/extensions/reference/api/storage).
- [Store policies](https://developer.chrome.com/docs/webstore/program-policies/policies).
- [AI-assisted development](https://developer.chrome.com/docs/extensions/ai/build-with-ai). Suggested debugging tools are not included in this package.
