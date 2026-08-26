# Phoenix Drilling — landing page directions

Three landing page directions for Phoenix Drilling, a West Lothian drilling
contractor. Published as a design canvas at
https://claude.ai/code/artifact/342899da-1589-4804-a205-03a7a310e2e2

## Source files

| File | Direction |
| --- | --- |
| `Main.dc.html` | **A — Depth.** Dark and technical. Depth rail down the left, services as ledger rows keyed to working depth. |
| `DirectionB.dc.html` | **B — Yard.** Industrial and dense. Hard rules, quote form in the hero, services as a spec index table. |
| `DirectionC.dc.html` | **C — Ground.** Bright editorial. Fixed left label column, content indented right of centre, services as an entry list. |
| `canvas.json` | Artboard layout, titles and the notes shown above each direction on the canvas. |

Each artboard is authored at 1440px wide.

## Before this goes near a browser

- Anything in `[SQUARE BRACKETS]` is a fact that was not supplied: phone,
  address, opening hours, team names, client and project names, years and
  figures.
- Testimonial wording is draft copy written to show the shape of the section.
  It is not real client wording and must be replaced.
- Team and case study imagery is placeholder vector art. Real photography is
  needed, particularly for direction A, which leans on it hardest.

## Regenerating the canvas

`phoenix-drilling-landing.html` is a build output and is gitignored. It is
reseeded from the files above with the `/design` skill's `seed-canvas.mjs`.
