# Phoenix Drilling — Divi layout

`phoenix-drilling-divi.json` is an importable Divi layout of the landing page.
It is generated from the static site, so the two stay in step.

```
phoenix-drilling-divi.json   The file you import (~88 KB)
build-divi-layout.py         Generates it from ../index.html and ../assets
validate-divi-layout.py      Structural checks — run after every build
style.css                    The stylesheet the layout carries with it
```

Rebuild after any change:

```bash
python3 build-divi-layout.py && python3 validate-divi-layout.py
```

---

## Import it

1. **Pages → Add New**, then **Use Divi Builder**.
2. Open the **portability** menu (the ⇅ icon in the builder's bottom bar) → **Import**.
3. Choose `phoenix-drilling-divi.json`. Leave *"Download backup before importing"* ticked.
4. Save, then **Divi → Theme Options → Builder → Advanced → Static CSS File Generation →
   Clear**. Divi caches generated CSS aggressively and a stale cache is the most common
   reason an imported layout looks wrong on the frontend.
5. View the **frontend**, not the builder. The Visual Builder renders in an iframe with a
   different CSS context and is not a reliable preview of custom CSS.

A layout exported from a page must be imported into a page — not the Library or the
Theme Builder.

### Fonts

The layout asks for **Space Grotesk** and **Inter**. Load them once, sitewide, or the page
falls back to Helvetica and loses most of its character. Either add them under
**Divi → Theme Options → General** if your setup exposes Google Fonts, or put this in
**Theme Options → Custom CSS** (no `<style>` tags there):

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
```

---

## Why this is a Divi 4 payload that becomes Divi 5 on import

Divi 5 stores page content as JSON blocks rather than shortcodes, but **Elegant Themes has
not published that schema.** There is no public spec to author against, and a guessed
structure produces a file that either fails to import or imports as garbage.

What *is* documented is the conversion path. Divi 5's migrator converts every **core**
Divi module from shortcode format to the new block structure, preserving content and
design settings. Only third-party modules fall back to the Divi 4 compatibility
framework — and a single one of those forces the whole page to load the legacy framework,
with the performance cost that implies.

So this file uses the stable Divi portability envelope containing **core modules only**.
Divi 5 converts it on import and the page is native D5 afterwards, with no compatibility
layer. It also imports directly into Divi 4 if you are not on 5 yet.

---

## What is a real Divi module, and what is not

Honest accounting, because it affects what your client can edit without touching code.

**Native modules — editable in the builder as normal:**

| Module | Used for |
| --- | --- |
| Section / Row / Column | The whole page structure, with per-section background and padding |
| Text | Every section heading, eyebrow and lede |
| Button | The two hero calls to action |
| Accordion | The six FAQ items |
| Contact Form | The quote enquiry, including the service dropdown |

**Code modules — designed components, edited as markup:**

| Component | Why not a native module |
| --- | --- |
| Stylesheet + icon sprite | One module at the top of the page carries both |
| Service and sector cards | Custom SVG icons the Blurb module cannot hold |
| The strata cross-section | A bespoke 1400×700 SVG diagram with no module equivalent |
| Stat strip, process steps, spec list, project cards, office list | Bespoke layouts built on hairline rules and a shared grid |
| The illustrations | Inlined as SVG, so the layout imports with **no media library dependency** — nothing to upload, no broken image URLs |

Blurb modules were the obvious native choice for the service cards, but Divi's Blurb
takes either an ETmodules font icon or an uploaded image, and neither can carry the
line-drawn SVG icons this design uses. Text over fidelity was the wrong trade here.

---

## Differences from the static site

- **No header or footer.** Those belong in the Divi **Theme Builder**, not in a page
  layout — importing them here would double up with your theme's own chrome.
- **No scroll animations.** The static site reveals sections on scroll, counts the hero
  stats up, and lights the strata labels in sequence. None of that is in this layout.
  Divi has its own Animation options per module if you want a version of it; the design
  reads fine static.
- **Section anchors.** The hero button points at `#phx-quote`. Set that CSS ID on the
  quote section (Section → Advanced → CSS ID) after import, or edit the button URL.

## The stylesheet

`style.css` is bundled into the first Code module, so the layout is self-contained. It
follows the Divi 5 rules that actually matter:

- Custom properties are declared on `:root`, not on a component, so they resolve reliably.
- Everything that collides with a Divi module style uses the documented override pattern —
  a `body` prefix for weight and `!important` on every property. Buttons in particular do
  not take an override without both.
- Everything scopes under `.phx`, so it cannot leak into your header, footer or other pages.
- Section and row **vertical** padding is left to Divi's own `custom_padding` fields — the
  stylesheet only sets the horizontal gutter. Resetting `padding` wholesale would collapse
  every band.

If you would rather manage it centrally, move the contents of the `<style>` block into
**Theme Options → Custom CSS** (strip the `<style>` tags — Theme Options rejects them) and
delete that first Code module.

## Before it goes live

The three case studies are **representative, not real jobs**, and carry no client names —
the same caveat as the static build. Replace them with real, client-approved projects.
See the root `README.md` for the full pre-launch checklist.
