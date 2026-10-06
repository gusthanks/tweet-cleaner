# Chrome Web Store listing

Primary listing language: English. The extension starts in English and offers Portuguese through PT/EN.

## Name

Tweet Cleaner

## Short description

Clean X posts, reposts, bookmarks and likes with preview, pause and resume. Free, with locally saved progress.

## Detailed description

Tweet Cleaner opens a panel on X to help clean your posts, replies and reposts, or remove bookmarks and likes.

- Preview without changes and reuse the found IDs later.
- Run continuously without paid quotas imposed by the tool.
- Pause, resume or stop when needed.
- Wait automatically when X responds with a rate limit.
- Resume using locally saved IDs, skipping successfully deleted posts.
- Optionally use an X data archive to find older posts.
- Remove bookmarks/likes while preserving the posts.
- Optionally filter likes/bookmarks by explicit X adult content warnings in English or Portuguese. Unrecognized/generic sensitive labels are preserved.
- Switch between English and Portuguese; remember the choice without online translation.
- Export a report to your computer.

Free. No ads, subscription or developer data-collection server. The extension accesses the tab only when invoked and does not request permanent access to all websites.

Deleting posts is permanent. Each mode requires confirmation of the action and signed-in account. Preview is on by default. Older items may be omitted by X; finishing a run does not guarantee that all history was removed. Keep the tab open with an active X session. Switch manually to Replies, Reposts, History → Likes or main Bookmarks as needed. Bookmark folders are not supported.

Independent tool, not affiliated with X or Google. Internal X endpoints can change. X may restrict website automation; respecting rate limits does not eliminate that risk. Messages, followers and profile data are not removed.

## Single purpose

Let users clean their own X account history — posts, replies, reposts, likes and bookmarks — with execution controls and local resume.

## Permission justifications

- **activeTab:** temporary access to the invoked tab to identify the signed-in account, read post links/markers on the profile, Likes or Bookmarks page, and show the panel.
- **scripting:** inject the bundled panel engine in an isolated context. No remote code or automatic injection across websites.
- **storage:** remember the English/Portuguese preference locally and share it between popup/panel. No Chrome sync; cleanup progress remains in X site storage.

## Data handling

Read the full privacy policy before answering the form. Account identity, post links/IDs, repost/like/bookmark markers and selected archives are processed locally. During cleanup, the CSRF token and browser session are used only for requests sent directly to X. Completed/pending IDs live in X origin storage, separated by account/mode; reports are local downloads initiated by the user. No data sale, developer transfer or analytics.

The adult filter reads page media warnings and records only a classification flag with pending IDs. No media is opened, no post text is analyzed and no AI is used. Filtered/general lists are separate. Hidden or unrecognized warnings are preserved. These data may reveal personal interests; account for this in privacy declarations.

## Reviewer instructions

1. Use an X test account controlled by the reviewer. No extension account is required.
2. Open the signed-in account's profile and invoke the extension.
3. Click **Open panel in this tab**; **Preview without changes** should start checked.
4. Click **Find posts**, stop scanning and inspect counters. Preview sends no mutation requests.
5. Click **PT**, then **EN**. Text/confirmation language changes, progress stays intact and the preference survives reopening.
6. To test deletion, first create a disposable post. Uncheck preview and type the requested phrase. Real deletion is irreversible.
7. Pause/resume/stop and export a report. Refresh the profile to check results.
8. Like and bookmark a disposable post. Open **History → Likes** (`/i/history/likes`) or main Bookmarks and invoke the extension. Mode should follow the page. Legacy own-profile Likes is also accepted. Preview should send no changes.
9. Uncheck preview and use the action-specific phrase. Refresh and confirm that the interaction is removed but the post remains. Repeat in the other mode; histories must be independent of posts.
10. For the filter, preview items with/without explicit X adult media warnings in either supported language. Generic notices and lookalike text in posts/quotes must be preserved. No media opens. Filtered confirmation includes ADULT (ADULTOS in Portuguese). Synthetic demo data does not replace live testing.

Do not supply personal credentials in the form. If X changes its API or restricts the session, the panel stops with an error rather than recording false success.
