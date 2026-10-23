# Coul House Hotel — website

A marketing website for Coul House, a family-run Georgian country house hotel in Contin,
by Strathpeffer, Ross-shire. The site is designed to feel calm, refined and traditional,
and to move visitors toward one action: booking a stay, a table, or an event.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no npm install.

---

## Preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly from disk also works —
the icon sprite is inlined in every page precisely so it does.

## Deploy

Copy the repository contents to any static host:

- **GitHub Pages** — Settings → Pages → deploy from branch, root folder.
- **Netlify / Vercel / Cloudflare Pages** — no build command, publish directory `.`.
- **Traditional hosting** — upload the folder by FTP. Nothing server-side is required.

---

## Structure

```
index.html          Home
house.html          The House — story, values, timeline since 1821
rooms.html          Rooms & suites, one block per room type
dining.html         The kitchen, a sample menu, table bookings
weddings.html       Weddings
corporate.html      Meetings, away days, private dining, exclusive use
offers.html         Seasonal offers and breaks
location.html       Things to do nearby, and how to get here
gallery.html        Filterable photo gallery with lightbox
contact.html        Contact form (#enquiry), details, FAQ (#faq)
book.html           Reservation request, prefilled from any booking link
our-story.html      Redirects to house.html (old URL)
experiences.html    Redirects to location.html (old URL)

assets/css/style.css   Whole design system in one file
assets/js/main.js      All behaviour; progressive enhancement only
assets/img/crest.png   The house line-drawing logo (white, for dark grounds)
assets/img/*.svg       Illustrations (see "Photography" below)
```

### Design system

`assets/css/style.css` is organised top to bottom: tokens → reset → layout → type →
buttons → header & menus → heroes → media → home components → rooms → content blocks →
gallery → forms → booking dialog & toast → footer → reveals → utilities.

Colours and type live as custom properties in `:root`. Changing the brand means editing
those tokens, not hunting through rules.

| Token | Value | Used for |
| --- | --- | --- |
| `--green` | `#1d2a22` | Primary dark — dark bands, text on light |
| `--green-deep` | `#16201a` | Footer, menus, darkest bands |
| `--gold` | `#ad884c` | The accent — buttons, numerals, rules |
| `--gold-light` / `--gold-deep` | `#c2a065` / `#7a5f2e` | Gold text on dark / on light |
| `--linen` | `#ece7df` | Light band background |
| `--ivory` | `#f6f4ee` | Headings on dark |

Type is Cormorant Garamond (display) and Jost (body, and the spaced-out uppercase
`.eyebrow` labels), loaded from Google Fonts with system fallbacks in the stack.

Each band sets its own ground with `.section--linen`, `.section--green` or
`.section--deep`; text colours follow automatically.

### JavaScript

Everything degrades without it: every "Check Availability" / "Reserve" button is a real
link to `book.html`, the "More" menu shows its links inline, room descriptions are all
open, and the filter chips are hidden. `main.js` adds:

- the quick **booking dialog** (any link with `data-book`), which carries the chosen room
  or offer through to `book.html`
- the **More** dropdown and the full-screen **mobile menu**
- the home page room accordion, gift-voucher picker and destination filter
- room photo thumbnails, the House timeline arrows, gallery filters and lightbox
- scroll reveals, date logic and the enquiry-form handler

It honours `prefers-reduced-motion` throughout (the accolades marquee stops and shows
the list once).

---

## Things to wire up before launch

### 1. Booking engine

Every availability form currently posts to `book.html`, which captures a reservation
request and shows the phone number and email. To hand booking over to a real engine,
edit the two constants at the top of `assets/js/main.js`:

```js
var BOOKING_URL = 'book.html';           // ← your engine's deep-link base
var BOOKING_PARAM_MAP = {                 // ← rename our fields to theirs
  arrive: 'arrive', depart: 'depart', guests: 'guests', rooms: 'rooms'
};
```

Nothing else needs to change. SiteMinder, Guestline, ResDiary and Little Hotelier all
accept dates as query parameters; check your provider's documentation for the exact
parameter names and put them on the right-hand side of the map.

### 2. Form submissions

The enquiry forms on `contact.html`, `weddings.html` and `book.html` are marked
`data-demo-form` and currently show a message directing the visitor to phone or email —
they do not send anything. Point them at whatever handles mail for the hotel (Formspree,
Netlify Forms, or a script on the host) and remove the `data-demo-form` attribute.

The footer **mailing-list** form (`data-newsletter`) likewise sends nothing yet; it tells
the visitor to email instead. Connect it to the hotel's mailing service (Mailchimp,
Brevo …) and replace its handler in `main.js`.

The **map** on `contact.html` and `location.html` is a link to Google Maps. Swap the
`.map-placeholder` link for an embedded map if you want one on the page.

---

## Photography

The illustrations in `assets/img/` are hand-built SVG scenes, made so the site looks
finished before a photographer has been near it. They are self-contained — no external
requests, about 100 KB for the lot.

**To swap in real photography**, replace the `src` on the relevant `<img>`. Nothing else
needs to change; the CSS handles cropping through `object-fit`.

| File | Where it appears | Ideal replacement |
| --- | --- | --- |
| `hero-highland.svg` | Home hero, gallery | The house or glen at dawn, landscape, very wide |
| `octagonal-restaurant.svg` | Dining hero, home, house, weddings | **The Octagonal room — the single most valuable photo on this site** |
| `house-exterior.svg` | House and offers heroes | The frontage across the lawn |
| `suite.svg` | Rooms hero, Octagonal Suite, Four-Poster Room | The Four-Poster Master Bedroom |
| `room-classic.svg` | Country Deluxe, Garden View, Snug Single | A classic double |
| `drawing-room.svg` | Home welcome, corporate hero, quote bands | The drawing room with the fire lit |
| `wedding.svg` | Weddings hero, home celebrations band | A real wedding on the lawn |
| `grounds.svg` | Several | The grounds in summer |
| `glen.svg` | Location hero, home location | Strathconon or the hills |
| `falls.svg` | Location, house, gallery | Rogie Falls |
| `dining.svg` | Dining, home, gift voucher | A table laid for dinner |
| `whisky.svg` | Dining, home, house | The bar |
| `favicon.svg` | Browser tab | Keep, or use the hotel's own mark |
| `crest.png` | Header and footer logo | Keep — the house line drawing from the design |

Hero images want to be at least 2000px wide and should read well when cropped tall on a
phone. Keep the `alt` text descriptive when you swap.

---

## Verify before going live

Content on this site was assembled from publicly available sources, because the live site
blocks automated access. **Everything below should be confirmed by the hotel before
launch.**

### Confirmed against public sources

- Built 1821 for the Mackenzies of Coul; run by Stuart and Susannah Macpherson
- 21 en suite bedrooms, no two alike — *one source says 22, as does the design; please confirm*
- Eight acres of mature woodland
- The Octagonal Restaurant: ornate ceiling ~18ft, fireplace, three ceiling-to-floor
  windows onto Strathconon; **one AA Rosette**
- Weddings: licensed for civil ceremonies, up to 80 through the day, 140 in the evening;
  approx. 1,400 sq ft across three rooms
- Dogs welcome in all bedrooms and public areas **except the restaurant**, £7.50 per dog
  per night
- Rooms include a 32-inch flat-screen TV, tea and coffee, a seating area, free toiletries;
  Superior rooms have a roll-top bath and walk-in rainforest shower
- Contin, Ross-shire IV14 9ES · +44 (0)1997 421487 · stay@coulhouse.com
- Around 25 minutes north of Inverness; Achilty Forest and Rogie Falls 2 miles;
  Strathpeffer 3 miles; Brahan Estate 3 miles; on the North Coast 500

### Needs the hotel's input

- [ ] **Room count.** The site now says **twenty-two** rooms (from the design); some
      public sources say 21. Confirm, and update the copy and `numberOfRooms` in the
      home page's structured data if needed.
- [ ] **Room types and rates.** The five room types (Octagonal Suite, Country Deluxe,
      Garden View, Four-Poster Room, Snug Single), their sizes, beds and "from" prices
      come from the design. Replace with the hotel's real room list and current rates.
      Room names appear on `index.html`, `rooms.html` and the `book.html` room select.
- [ ] **Head chef.** The copy names "local chef Garry Kenley" — please confirm.
- [ ] **Menus.** The dishes on `dining.html` are a *sample*, not the real menu.
- [ ] **Offers.** The four breaks on `offers.html` (and "Save 15% in August") need real
      prices and terms.
- [ ] **Gift vouchers.** Voucher links go to `coulhousehotel.vouchercart.com/app`, and the
      home page shows three example vouchers (£120, £55, £320). Confirm both.
- [ ] **Corporate capacities.** Boardroom 16, theatre 40, banquet 80, reception 120 come
      from the design — confirm.
- [ ] **Wedding capacity.** The site shows "80–140 day & evening guests", from public
      sources; the design said "120 seated". Confirm which is right.
- [ ] **Timeline.** The 1920s, 1980s, 2010 and 2018 entries on `house.html` come from the
      design and need checking against the house's real history.
- [ ] **Quotes.** The guest quote on `weddings.html` ("Eilidh & Tom") is a placeholder from
      the design. Replace it with a real, approved review — or remove it — before launch.
- [ ] **Accolades.** "Good Hotel Guide" appears in the home-page marquee and footer.
      Confirm the listing is current.
- [ ] **Email address.** The design used `stay@coulhousehotel.com`; the site keeps
      `stay@coulhouse.com`, which public sources confirm. Check which inbox is live.
- [ ] **Reception hours** ("open daily, 8am – 10pm") and the travel times on
      `location.html`.
- [ ] **Deposit and cancellation policy** — the site says "no pre-payment, no deposit,
      free cancellation up to two days before arrival". Confirm.
- [ ] **Social links, Privacy and Terms pages** — not yet on the site.
- [ ] **Domain.** Canonical tags and the sitemap assume `https://www.coulhousehotel.com/`.
      Update if that is wrong.

---

## Editing pages

Each page is a complete, standalone HTML file — open it and edit the text. The header,
footer and icon sprite are repeated in each file, so **a change to the navigation must be
made in all eleven pages.** If that becomes tiresome, move the site to a static site
generator (Eleventy or Astro) with the chrome in a layout; the CSS and JS will carry over
unchanged.
