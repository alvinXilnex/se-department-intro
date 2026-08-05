# Instructions for Claude working in this repo

This is the interactive HTML version of the Xilnex SE Department intro deck.
**Read `README.md` first** — it has the full editing guide and styling rules (color palette,
coordinate system, which helper functions to reuse, animation conventions, what not to do).
Follow it exactly; don't invent a new visual pattern for a one-off change.

Live site: https://alvinxilnex.github.io/se-department-intro/
Repo: `alvinXilnex/se-department-intro` on `main` — GitHub Pages auto-rebuilds ~30–60s after a push.

## When asked to update a slide (or anything in this deck)

1. Make the edit in `deck.js` (or `style.css`/`app.js`/`presenter.js` if it's genuinely structural,
   not content) per the conventions in `README.md`.
2. **After every change, open the result in the browser automatically** so the user can see it
   without asking — don't wait to be told to preview:
   ```bash
   open "index.html"
   ```
   (On Windows use `start index.html`, on Linux `xdg-open index.html`.) This opens the local file
   directly — it reflects your edit instantly, no build step and no wait for Pages to rebuild.
   If a browser window for this deck is already open, just reloading is fine too — the goal is the
   user sees the updated slide immediately after your change, unprompted.
3. If the user's photo/content in `assets/` changed, or you touched the databases/tech-stack/org
   data, double check `README.md`'s "what not to do" section still holds (no fabricated content,
   no ad-hoc colors).
4. Once the change looks right, offer to commit and push so the **live** site updates too:
   ```bash
   git add -A && git commit -m "describe the change" && git push
   ```
   Only do this if the user wants it published — pushing makes the change visible to anyone with
   the live link, not just on this machine. After pushing, mention the live URL will update in
   ~30–60 seconds; you don't need to wait for it or poll it.
5. If the user also wants a portable single-file copy refreshed, run:
   ```bash
   node build-single.js
   ```
   This regenerates `SE-Intro-Standalone.html` (only needed when someone wants a file to email/
   AirDrop instead of the live link).

## Don't
- Don't skip opening the browser after an edit — that's the whole point of this workflow.
- Don't push to `main` without the user's go-ahead; local preview is always fine, publishing isn't
  automatic.
- Don't restructure the multi-file dev setup (`index.html`/`deck.js`/`app.js`/`presenter.js`/
  `style.css`) into something else — `build-single.js` is what produces the portable bundle, the
  dev files are the source of truth and should stay editable independently.
