# Chrome Web Store preparation

Publication index for 3.2.0, based on [Google's AI-assisted extension guidance](https://developer.chrome.com/docs/extensions/ai/build-with-ai).

## Purpose and permissions

Single purpose: clean the user's own X history, including posts, replies, reposts, likes and bookmarks. Interaction modes preserve posts and optionally filter explicit adult media warnings, without image analysis or AI.

The [manifest](extension/manifest.json) uses Manifest V3, `activeTab`, `scripting` and `storage`. Bundled code runs after invocation in the active tab. Storage remembers only the English/Portuguese preference. No remote code, ads, analytics, sync or permanent host access.

## Publication sources

- [Installation, upload and submission](docs/CHROME-WEB-STORE.md).
- [Listing, purpose, permissions and reviewer instructions](docs/STORE-LISTING.md).
- [English privacy policy](extension/privacy.html) and [Portuguese policy](extension/privacy-pt.html).
- [Validation and limitations](docs/VALIDATION.md).
- `npm run package` generates `dist/tweet-cleaner-3.2.0.zip` with the manifest at the ZIP root.

## Status

Package and English-first documentation prepared. Automated checks and demo use synthetic data. Live installation/testing on an X test account: `[DADO A CONFIRMAR]`. Internal endpoints can change.

Public publisher name/contact, HTTPS privacy URL, category and distribution countries: `[DADO A CONFIRMAR]`. This marker means information still needs confirmation. No store submission, payment or policy hosting has been performed.

Google's guide suggests skills and Chrome DevTools MCP for installation/reload/debugging. They were not installed by this project and are not runtime dependencies.
