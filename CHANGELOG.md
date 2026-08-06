# Changelog

Notable changes to the deck, most recent first. Each entry links back to the commit(s) that made it.

## 2026-08-06 — Presenter feedback round

Feedback after the first live run: the talk moved too fast (~10 min), read as "dry telling"
rather than a story, needed to work for a mixed technical/non-technical audience, and was
missing a couple of structural/organizational details.

- **Slower, storytelling speaker notes** — rewrote the "what to say" script on all 14 slides:
  warmer opening, plain-language framing, explicit invitations to pause for questions, and
  more narrative connective tissue between slides instead of a flat list of facts. Should
  meaningfully extend delivery time past the previous ~10 minutes.
  (`7e05f78`)
- **Product Solution added as SE's closest collaborator** — new, most-prominent row on the
  Cross-Department Collaboration slide, badged "Most Frequent Collaborator." Modeled as an
  ongoing embedded partnership (Domain Engineers ⇄ Domain Product PIC) rather than a
  ticket-based workflow like Support/PMO.
  (`7e05f78`)
- **Readability pass** — enlarged font sizes on subtitles, bullet lists, card body copy, tech
  stack chips, and cross-department step boxes; kept the text-width measuring helpers in sync
  so nothing overflows.
  (`7e05f78`)
- **Domain Product PIC names added to the org chart** — each domain role box on Department
  Structure now shows a `PIC ·` line naming the domain's Product Solution PIC (Li Foong, Ooi
  Zhi Hao, Lim Ni Feih, Mak Kai Shun, Yong Jian). Customer Engagement's two roles don't have a
  PIC yet — shown explicitly as "Not yet assigned" rather than omitted.
  (`f89d9dc`)
- **Department Structure layout retuned** for the extra PIC line — tightened the enablement/
  platform team cards (removed dead vertical space between name and lead) and re-spaced the
  domain cards and legend so nothing overlaps the footer logo.
  (`f89d9dc`)
- **Fixed entrance animation on Department Structure** — role/lead/PIC text and the
  enablement card text were missing `anim`, so they appeared instantly while only the card
  shape behind them animated in. Text and card now fade in together.
  (`9967dd3`)
- **Matched CTO and Head of Department card widths** — was 3.5in vs 3.7in, now both 3.7in.
  (`1a6c692`)

## Earlier

- Fixed Team Snapshot stat count-up (50+ / 15+ / 4) finishing before the card had faded in,
  in both the audience view and the presenter-view preview; fixed the presenter view's
  "Next Slide" panel rendering fully off-screen due to a CSS containing-block bug.
  (`6cc25e5`, `52b503f`)
- Added `(Ekin)` next to Eng Aik Kian on the org chart; added MySQL and ClickHouse to the
  Tech Stack database list.
- Initial interactive HTML deck, presenter view, README, and `CLAUDE.md` editing workflow.
  (`ed22fed`–`e3c5096`)
