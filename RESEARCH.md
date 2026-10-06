# Vendor research — 2026-10-03

Public documentation only. No proprietary code was extracted and no paid execution was performed. These notes describe findings on the dates recorded, not permanent pricing or API guarantees.

- [TweetDelete FAQ](https://tweetdelete.net/faq/): advertised 500 tweets/likes per month on Pro. This is a subscription quota, not a safe per-run ceiling. It described tasks, counters, archive import, revocable authorization, rate limits and interruption after excessive errors.
- [Official TweetDelete extension](https://chromewebstore.google.com/detail/tweetdelete-%E2%80%93-delete-twee/aifggeijadkgmindifghoaefhgjjklkh): advertised preview, background tasks and progress. Public copy did not specify exact deletion pacing.
- [TweetDeleter FAQ](https://tweetdeleter.com/faq/): described authorization to retrieve posts through X's API. An authorized API service cannot be assumed equivalent to a browser-console script.
- [DeleteTweets extension](https://chromewebstore.google.com/detail/deletetweets-bulk-delete/mppblpedoemekekejafmcopafmkagkic): described bulk deletion; public documentation did not establish 500/run as X guidance or disclose exact pacing.
- [X automation rules](https://help.x.com/en/rules-and-policies/x-automation): warn against unofficial website scripting and bypassing limits. Calling internal web-client endpoints has no guarantee of acceptance or immunity from suspension.

Engineering conclusion: 500 was a user-chosen workload cap. Reusable preview, resume, sequential requests, respecting rate limits and stopping on errors improve control; they do not prove compliance or account safety. No claim is made that this tool uses the same pacing as paid extensions. The user later requested continuous execution without that cap.

## Bookmarks, likes and Chrome guidance — 2026-10-05

- [X's bookmark guide](https://help.x.com/en/using-x/bookmarks) describes individual removal and clear-all from the main page menu. The panel mentions that native action; extension mode retains per-item preview/resume.
- Internal operations `DeleteBookmark` and `UnfavoriteTweet`, both with `tweet_id`, were checked against primary public code: [Twikit GraphQL](https://github.com/d60/twikit/blob/main/twikit/client/gql.py), [twitter-cli GraphQL](https://github.com/public-clis/twitter-cli/blob/main/twitter_cli/graphql.py) and [twitter-openapi endpoints](https://github.com/fa0311/twitter-openapi/blob/main/src/config/placeholder.json). These were protocol references; their code was not incorporated.
- [twitter-openapi response schema](https://github.com/fa0311/twitter-openapi/blob/main/src/openapi/paths/post.yaml) distinguishes `tweet_bookmark_delete` and `unfavorite_tweet` from post-deletion responses. Interaction success requires explicit `Done`; unexpected responses remain failures.
- Page/marker/type checks and independent lists isolate the modes in synthetic tests. They do not prove live X marker/endpoint compatibility.
- [Google's AI-assisted extension guide](https://developer.chrome.com/docs/extensions/ai/build-with-ai) suggests guidance skills and Chrome DevTools MCP for installation/reload/debugging. CHROMEWEBSTORE.md documents purpose, permissions and publication sources. Suggested tools were not installed and are not package dependencies.
- [X's adult policy](https://help.x.com/en/rules-and-policies/adult-content) distinguishes adult warnings from generic sensitive media. [Media settings](https://help.x.com/en/rules-and-policies/media-settings) also cover violence/other categories. The filter requires an explicit English/Portuguese adult media warning; it does not infer labels from post text or generic sensitive notices. Hidden or unrecognized warnings are preserved. Live validation remains necessary.

## Language preference — 2026-10-06

[Chrome's storage documentation](https://developer.chrome.com/docs/extensions/reference/api/storage) requires the `storage` permission and supports shared local preferences/change listeners across extension contexts. Version 3.2.0 uses it only for the English/Portuguese choice, with no sync or translation service. Cleanup lists keep the existing X origin storage format.
