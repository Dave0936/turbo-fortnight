# Phoenix Drilling — landing page

A single-page marketing site for Phoenix Drilling Ltd, a specialist drilling contractor in
Livingston, West Lothian. Ground investigation, water extraction boreholes and geothermal
drilling, UK-wide. The page exists to do one thing: turn a consultant, contractor or
developer into a quote enquiry.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no `npm install`.

---

## Preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` straight from disk also works —
the icon sprite is inlined in the page precisely so it does.

## Deploy

Copy the repository contents to any static host:

- **GitHub Pages** — Settings → Pages → deploy from branch, root folder.
- **Netlify / Vercel / Cloudflare Pages** — no build command, publish directory `.`.
- **Traditional hosting** — upload the folder by FTP. Nothing server-side is required.

---

## Structure

```
index.html             The whole site
assets/css/style.css   Design system in one file
assets/js/main.js      All behaviour; progressive enhancement only
assets/img/*.svg       Illustrations (see "Photography" below)
robots.txt sitemap.xml
```

### Design system

`assets/css/style.css` is organised top to bottom: tokens → reset → layout → type →
buttons → utility bar → header → hero → credentials → services → depth → splits →
sectors → process → projects → coverage → forms → accordion → footer → sticky CTA →
reveals → utilities.

The brand lives entirely in the custom properties at the top. Rebranding means editing
tokens, not hunting through rules.

**Core is a single graphite ramp.** It carries every surface, rule and run of body text.

| Token | Value | Used for |
| --- | --- | --- |
| `--graphite-900` | `#0e1113` | Hero, footer, quote band |
| `--graphite-800` | `#16191c` | Page base on dark sections |
| `--graphite-700` | `#22272b` | Raised surfaces, cards on dark |
| `--graphite-600` | `#333a3f` | Hairlines on dark |
| `--graphite-400` | `#7d868c` | Muted text, both modes |
| `--graphite-100` | `#eceef0` | Light band background |
| `--paper` | `#f9fafa` | Light surfaces, form fields |

**Accents are red and orange, and nothing else.**

| Token | Value | Used for |
| --- | --- | --- |
| `--red` | `#e8112d` | **Action** — primary CTAs, the one thing to click |
| `--orange` | `#ff6a13` | **Emphasis** — rules, numerals, eyebrows, annotations |
| `--heat` | orange → red gradient | The depth scale, the hero ruler, card edges |

The rule the page is built on: **red means _do this_, orange means _look here_.** Never
both on the same element, and never as a filled background panel — they appear as type,
1–2px rules, small marks and one button. On a page this grey, two hot colours at about
5% coverage is what makes it read as expensive rather than loud.

**Contrast, if you change these values.** `--red` on `--graphite-900` sits around 4.3:1,
so it is fine for display type, rules and white-on-red buttons but must not carry body
copy on dark — `--orange` does that job there. Inverted on the light bands: red passes
for normal text, orange does not, so orange stays large-only. Sections set
`--accent-text` to whichever of the two passes on their background; components read that
token rather than naming a colour.

Type is Space Grotesk (display) and Inter (body), from Google Fonts with system
fallbacks in the stack.

### JavaScript

Everything degrades. With scripts off the nav is a plain list, every section is visible,
the strata diagram is fully annotated, all FAQ answers are open, and the form submits
normally.

`main.js` adds the sticky header state, mobile nav, scroll reveals, the anchor-nav
scrollspy, the hero stat count-up, the strata annotation reveal, the accordion, the
sticky mobile CTA and the quote-form validation. It honours `prefers-reduced-motion`
throughout.

Two details worth not "tidying away":

- The reveal observer has a `requestAnimationFrame` **sweep safety net**. A fast fling or
  a jump to an anchor can move an element through the viewport between rendered frames,
  so the observer never sees it intersect and the content would stay invisible forever.
- The strata annotations and the FAQ panels are **hidden by the script, not the
  stylesheet**. If `main.js` fails to load, the diagram stays labelled and the answers
  stay readable.

---

## Two things to wire up before launch

### 1. The quote form

The enquiry form is marked `data-demo-form` and currently shows a message directing the
visitor to phone or email — **it does not send anything.** To connect it, set an `action`
and `method` on the `<form>` and remove the `data-demo-form` attribute. Client-side
validation and the honeypot keep working either way.

Formspree, Netlify Forms, or a mail script on the host will all take it as-is. The
honeypot is the `.hp` field named `website`; configure your handler to drop any
submission where it is filled in.

### 2. The domain

Canonical tag, Open Graph URL, structured data and the sitemap all assume
`https://www.phoenixdrilling.co.uk/`. Update all four if that is wrong.

---

## Photography

The illustrations in `assets/img/` are hand-built SVG scenes, made so the site looks
finished before a photographer has been near a rig. They are self-contained — no external
requests, and the lot is well under 100 KB.

**To swap in real photography**, replace the `src` on the relevant `<img>`. Nothing else
needs to change; the CSS handles cropping through `object-fit`.

| File | Where it appears | Ideal replacement |
| --- | --- | --- |
| `hero-rig.svg` | Hero | **The most valuable photo on this site** — a rig on site at first light, landscape, very wide. Must still read when cropped tall on a phone. |
| `rig-rotary.svg` | Capability | A rotary rig coring on a prepared platform |
| `core-samples.svg` | Projects | Core boxes laid out and being logged |
| `water-borehole.svg` | Projects | Completed borehole headworks |
| `geothermal.svg` | Projects | Loop installation on a GSHP job |
| `crew.svg` | Spare — not currently placed | Crew in full PPE working a rig |
| `coverage-map.svg` | Coverage | Keep — it is a diagram, not a photo |
| `favicon.svg` | Browser tab | Keep, or use the company's own mark |
| `og-image.svg` | Link sharing | A photo version, 1200×630 |

The strata cross-section is inline in `index.html` rather than a separate file, because
the script needs to reach its annotation groups. Keep it as a diagram.

Hero images want to be at least 2000px wide. Keep the `alt` text descriptive when you
swap.

---

## Verify before going live

Content on this site was assembled from public directory and search sources, because the
live site blocks automated access. **Everything below should be confirmed by Phoenix
Drilling before launch.**

### Taken from public sources

- Phoenix Drilling Ltd, incorporated 11 January 2010, company number **SC370985**
- 2 Nairn Road, Livingston, West Lothian **EH54 8AY**
- **01506 411448** · **info@phoenixdrilling.co.uk**
- Offices in Livingston (head office), Inverness and Aberdeen; work delivered UK-wide
- Certified to **ISO 9001, ISO 14001 and ISO 45001**; listed with the Well Drillers
  Association
- Cable percussive fleet: **Dando 4000, 2000 and 150, Edeco-Pilcon 2000**
- Conventional and triple-tube coring using **air, water, polymer and mud flush**
- Services referenced: trial pitting, window sampling, rotary borehole drilling, mineral
  investigation, disused mineral workings and mine shafts, de-watering wells, quarry
  development, geothermal and water extraction boreholes, nearshore over-water drilling

### Needs the company's input

- [ ] **Projects.** The three case studies in `#projects` are *representative*, not real
      jobs — no client names, no specific sites. An HTML comment marks the swap point.
      Replace them with real projects, with client approval.
- [ ] **Plant list.** The capability table reflects publicly described kit. Confirm the
      fleet as it stands today, including rig counts and any restricted-access or
      over-water plant worth naming.
- [ ] **Accreditations.** Confirm certificate numbers and certifying bodies, and whether
      there are memberships not listed here (BDA, CHAS, Constructionline, SafeContractor).
- [ ] **Testimonials.** There are deliberately **none on this site**. If you want them,
      choose real clients, get written permission, and attribute them.
- [ ] **Inverness and Aberdeen offices.** Full addresses and direct numbers, if they
      should be published.
- [ ] **Office hours** — stated as Monday to Friday, 8am–5pm. Confirm.
- [ ] **The SEPA / CAR answer in the FAQ** — accurate in general terms, but have someone
      confirm the wording before it advises a customer.
- [ ] **Social links** — none are in the footer yet. Add them, or leave it clean.
- [ ] **Privacy and cookie notice** — not yet written. Needed before the form goes live.

---

## Editing

`index.html` is one standalone file — open it and edit the text. Section order, the icon
sprite and the structured data all live in there. If the site grows past a single page,
move it to a static site generator (Eleventy or Astro) with the header and footer in a
layout; the CSS and JS carry over unchanged.
