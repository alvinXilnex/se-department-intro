# SE Department Intro Deck

Interactive HTML version of the Software Engineering department intro deck. Live at:
**https://alvinxilnex.github.io/se-department-intro/**

No build step, no server required to preview locally — `index.html` runs by just opening it in a browser.

> **Using Claude Code to make edits?** This repo has a `CLAUDE.md` with instructions Claude follows
> automatically — including opening the updated slide in your browser right after every change, so
> you don't need to ask it to. Just tell Claude what to change and it'll show you the result.

## Files

| File | Purpose |
|---|---|
| `index.html` | Audience view — open this to present |
| `presenter.html` | Presenter view (opens automatically via the "🎤 Presenter View" button / `P` key) |
| `deck.js` | **All slide content and layout lives here.** This is the file you'll edit for almost every change. |
| `style.css` | Global styles, color variables, animation keyframes |
| `app.js` | Audience-side navigation, keyboard/touch controls, presenter-window sync |
| `presenter.js` | Presenter-side rendering, notes panel, timer |
| `assets/` | Images — logo, gradient background, corner motif, icon badges, speaker photo |
| `build-single.js` | Bundles everything into one portable file (see below) |
| `SE-Intro-Standalone.html` | Generated output of `build-single.js` — a single self-contained file you can email/AirDrop to someone with no GitHub access |

## How to update the slides

1. **Find the slide.** In `deck.js`, each slide is a clearly marked block:
   ```js
   // ---------- Slide 7: Team Snapshot ----------
   builders.push((s) => { ... });
   addNote("hint for the presenter", "the actual words to say");
   ```
   Search for the slide title in the comment to jump straight to it.

2. **Edit the content.** Change text strings, numbers, colors (use the existing palette constants — see below), etc. directly in that block.

3. **Preview locally.** Just open `index.html` in a browser (double-click it, no server needed) and check your change. Use arrow keys / click to navigate.

4. **Adding or removing a slide?**
   - Insert/remove a `builders.push(...)` + `addNote(...)` pair in the order you want it to appear (order in the file = order in the deck).
   - Update the `// ---------- Slide N: Title ----------` comment numbers for everything after your change, and the page-footer number passed to `footer(s, "NN", onDark)` (zero-padded for 1–9, e.g. `"07"`, plain for 10+).
   - Update the `DECK.titles` array at the very bottom of `deck.js` to match.

5. **Speaker notes.** Every slide has `addNote(hint, script)` right after its `builders.push(...)`. Keep the `script` grounded strictly in what's actually on the slide — no invented stats, no exaggeration. The `hint` is a short presenter-facing reminder of what to emphasize.

6. **Publish.**
   ```bash
   git add -A
   git commit -m "describe what changed"
   git push
   ```
   GitHub Pages rebuilds automatically — the live site updates within ~30–60 seconds of pushing to `main`.

7. **Regenerate the portable single-file copy** (only needed if you want to hand someone `SE-Intro-Standalone.html` directly instead of the link):
   ```bash
   node build-single.js
   ```

## Styling guidelines — please follow these instead of inventing new patterns

The whole point of keeping this consistent is that anyone can edit a slide and it still looks like it belongs in the same deck. Please don't hand-roll a new visual style for a one-off slide.

### Colors
Use the constants already defined at the top of `deck.js` — don't hardcode new hex values.
- `PURPLE`, `MAGENTA`, `TEAL`, `BLUE`, `AMBER` — the accent palette. Each of the 4 business domains has a fixed color used consistently everywhere it appears (Empower Workforce = `TEAL`, Customer Engagement = `MAGENTA`, Insights & Analytics = `PURPLE`, Integrations & Ecosystem = `BLUE`). Keep that mapping if you touch domain-related slides.
- `DARK`, `MUTED`, `MUTED_LIGHT`, `BG_SOFT`, `CARD_BORDER`, `PILL_BG`, `WHITE` — neutrals for text/backgrounds/borders.

### Layout / coordinate system
- The slide canvas is 13.333in × 7.5in (16:9). Every position/size you pass to `text()`, `roundRect()`, `place()`, etc. is **in inches** — internally 1 inch = 100 design px, but you never need to think in px, just inches, same as the original PowerPoint layout.
- Standard slide margin is 0.5in on each side.
- Use `header(slide, "Title")` for the standard eyebrow + title — don't hand-build your own title text.
- Every slide must end with `footer(slide, "NN", onDark)` — `onDark` is `true` only on the gradient hero slides (Title, Speaker, Questions, Thank You).
- Use `softBg(slide)` for normal content slides (light background + corner motif). Use `gradientBg(slide)` only for the hero/bookend slides.

### Reuse the existing helper functions — don't write raw `<div>`s for these
- `text()` / `richText()` / `bulletList()` — all text
- `roundRect()` — cards, pills, panels (`{ card: true }` gives the standard white card with border + shadow)
- `badge()` — the icon-in-gradient-circle pattern
- `hline()` / `vline()` — connector lines (`arrow: true` adds an arrowhead)
- For pill/chip/tag rows (see the Tech Stack slide's `chip()` function), measure text width with `measureTextWidth()` rather than guessing from character count — a character-count formula silently overflows once real font metrics differ. This exact bug broke a step box on the Cross-Department slide once; don't reintroduce it.

### Animation conventions
- Any element that should fade in on slide-entry gets `anim: N` in its options, where `N` is its 0-based stagger order within that slide.
- `roundRect(..., { pop: true })` gives a scale-in instead of fade-up (used for stat cards, the hub node, badges) — use it for "headline" elements, plain `anim` for everything else.
- **Don't combine `anim` with a custom grow/scale effect unless you verify the element still ends at full opacity.** Two real bugs happened this way: the Cross-Department arrows and the Team Snapshot progress bars both silently ended up stuck invisible/wrong-opacity because a second animation overrode the fade-in's opacity without setting its own. If you need width-only growth (like the headcount bars), animate `width` via a plain CSS `transition`, not the shared `anim`/`anim-grow` classes.
- You don't need to hand-tune delay timing in CSS — `DECK.build()` automatically normalizes every element's `--i` into an explicit `animation-delay` after the slide is built.

### Interactivity
- Existing patterns: **Domain Interactions** (click a domain node → highlights its connections, dims the rest) and **Career Paths** (click a track → highlights that path). If you add new interactivity, follow the same "click to focus, dim everything else" model rather than introducing a different interaction style (hover-only reveals, drag, etc.) without discussing it first.

### Things not to do
- Don't add new hex colors inline — extend the palette constants if you genuinely need a new one, and reuse that constant everywhere, not a one-off value.
- Don't hand-compute pixel positions — everything already takes inches through the helper functions.
- Don't fabricate or embellish speaker-note content.
- Don't skip the `footer(s, "NN", onDark)` call — it's what numbers the deck.

## Presenter View

Click **"🎤 Presenter View"** (or press `P`) on the audience view to open a second window with speaker notes, an elapsed timer, and current/next slide previews — synced live to whichever window you navigate from. It's a separate browser window only you (the presenter) see; the audience window never shows notes.
