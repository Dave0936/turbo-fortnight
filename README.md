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
rooms.html          Rooms & suites
dining.html         The Octagonal Restaurant, menus, afternoon tea, the bar
weddings.html       Weddings, plus #events for private and corporate
experiences.html    Rogie Falls, the hills, distilleries, the NC500
offers.html         Breaks and gift vouchers
our-story.html      History since 1821, plus the gallery
contact.html        Contact, directions, #enquiry form, #faq
book.html           Reservation request, prefilled from any availability bar

assets/css/style.css   Whole design system in one file
assets/js/main.js      All behaviour; progressive enhancement only
assets/img/*.svg       Illustrations (see "Photography" below)
```

### Design system

`assets/css/style.css` is organised top to bottom: tokens → reset → layout → type →
buttons → header → hero → booking bar → cards → splits → gallery → testimonials →
accordion → forms → footer → sticky CTA → reveals → utilities.

Colours and type live as custom properties in `:root`. Changing the brand means editing
those tokens, not hunting through rules.

| Token | Value | Used for |
| --- | --- | --- |
| `--forest` | `#2c3f2e` | Primary brand green |
| `--pine` | `#22301f` | Footer, dark overlays |
| `--gold` | `#b08d57` | The single accent — buttons, rules, prices |
| `--parchment` | `#faf7f1` | Page background |
| `--stone` | `#f1ece2` | Alternating band background |

Type is Cormorant Garamond (display) and Inter (body), loaded from Google Fonts with
system fallbacks in the stack.

### JavaScript

Everything degrades without it: the nav is a plain list, forms submit normally, images
show. `main.js` adds the sticky header state, mobile nav, scroll reveals, date logic,
accordions, the gallery lightbox and the enquiry-form handler. It honours
`prefers-reduced-motion` throughout.

---

## Two things to wire up before launch

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

---

## Photography

The illustrations in `assets/img/` are hand-built SVG scenes, made so the site looks
finished before a photographer has been near it. They are self-contained — no external
requests, about 100 KB for the lot.

**To swap in real photography**, replace the `src` on the relevant `<img>`. Nothing else
needs to change; the CSS handles cropping through `object-fit`.

| File | Where it appears | Ideal replacement |
| --- | --- | --- |
| `hero-highland.svg` | Home hero | The house or glen at dawn, landscape, very wide |
| `octagonal-restaurant.svg` | Dining hero, home, weddings | **The Octagonal room — the single most valuable photo on this site** |
| `house-exterior.svg` | Home, our story, contact | The frontage across the lawn |
| `suite.svg` | Rooms hero, four-poster | The Four-Poster Master Bedroom |
| `room-classic.svg` | Rooms, home | A classic double |
| `drawing-room.svg` | Offers, our story | The drawing room with the fire lit |
| `wedding.svg` | Weddings hero, home | A real wedding on the lawn |
| `grounds.svg` | Several | The grounds in summer |
| `glen.svg` | Experiences, contact | Strathconon or the hills |
| `falls.svg` | Experiences, home | Rogie Falls |
| `whisky.svg` | Dining, experiences | The bar |
| `favicon.svg` | Browser tab | Keep, or use the hotel's own mark |

Hero images want to be at least 2000px wide and should read well when cropped tall on a
phone. Keep the `alt` text descriptive when you swap.

---

## Verify before going live

Content on this site was assembled from publicly available sources, because the live site
blocks automated access. **Everything below should be confirmed by the hotel before
launch.**

### Confirmed against public sources

- Built 1821 for the Mackenzies of Coul; run by Stuart and Susannah Macpherson
- 21 en suite bedrooms, no two alike — *one source says 22; please confirm*
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

- [ ] **Rates.** `rooms.html` quotes "small doubles from £183" and "Four-Poster Master
      £165–£325", both from public listings and possibly out of date. Replace with current
      figures, or switch to "rates on request" throughout.
- [ ] **Menus.** The dishes on `dining.html` are labelled *sample* and are illustrative,
      not the real menu. Replace with the current one.
- [ ] **Offers.** The three breaks on `offers.html` are plausible constructions, not real
      packages. Replace with what the hotel actually sells, including prices and terms.
- [ ] **Guest reviews.** There are deliberately **no testimonials on this site.** The home
      page shows verified accolades instead, with an HTML comment marking where approved
      quotes should go. Choose real reviews, get permission, and attribute them.
- [ ] **Check-in and check-out times** — stated as "confirm with us"; put the real times in.
- [ ] **Deposit and cancellation policy** — currently described in general terms only.
- [ ] **Social links.** Footer Facebook and Instagram links are `#` placeholders.
- [ ] **Privacy and Terms pages** — linked in the footer, not yet written.
- [ ] **Domain.** Canonical tags and the sitemap assume `https://www.coulhousehotel.com/`.
      Update if that is wrong.

---

## Editing pages

Each page is a complete, standalone HTML file — open it and edit the text. The header,
footer and icon sprite are repeated in each file, so **a change to the navigation must be
made in all nine pages.** If that becomes tiresome, move the site to a static site
generator (Eleventy or Astro) with the chrome in a layout; the CSS and JS will carry over
unchanged.
