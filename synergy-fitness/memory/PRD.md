# Synergy Group Fitness — Landing Page

## Original Problem Statement
Create a high-end, award-worthy (Awwwards SOTD level) landing page for a premium fitness/performance gym. Cinematic, editorial, bold, athletic, sophisticated. Oversized typography, asymmetric compositions, full-bleed photography, grain/texture, large stats, generous spacing, parallax, kinetic masked hero reveal, slow editorial marquee, numbered manifesto chapters, framer-motion + lenis.

## User Choices
- Brand name: **Synergy Group Fitness**
- Sections: full experience (hero, programs, coaches, facilities, pricing, testimonials, contact/join CTA)
- Integrations: none — pure frontend landing page
- Palette: charcoal (#121212/#1A1A1A), bone (#F4F4F0), electric blue (#4C63F5)

## Architecture
- Pure frontend (React 19 + CRA/craco). No backend endpoints used; backend server.py untouched.
- Fonts: Oswald (display), Manrope (body), JetBrains Mono (accent) via Google Fonts @import in index.css
- Motion: framer-motion (already installed) + lenis 1.3.26 (installed via yarn) for smooth momentum scrolling with anchor-scroll interception in App.js
- Design source: /app/design_guidelines.json
- Components in /app/frontend/src/components/landing/: Nav, Hero, Marquee, Manifesto, Programs, Coaches, Facilities, Pricing, Testimonials, CTA, Footer

## User Personas
- Ambitious gym-goer evaluating premium group fitness memberships
- Returning visitor looking for class programs, coaches, and pricing

## Implemented (2026-08-12)
- Kinetic hero: masked line-by-line Oswald reveal ("Stronger / Together. / Every Rep."), parallax background image, glassmorphic sticky nav, scroll indicator
- Slow editorial marquee (55s, outline + solid alternating type, CSS keyframes)
- Manifesto: 3 numbered chapters (01 Show Up / 02 Do The Work / 03 Become More), asymmetric grid, outline-blue numerals
- Programs: 4 discipline rows (Forge/Pulse/Ride/Flow) with 1px bone grid borders and hover states
- Coaches: 3 editorial portraits in tall 3:4 frames, grayscale-to-color hover, staggered offset middle card
- Facilities: dual-image parallax gallery + stat band (12,000 sq ft / 24-7 / 120+ classes / 03 recovery suites)
- Membership pricing: 3 tiers with visible grid lines, featured Performance tier in electric blue ($89/$149/$229)
- Testimonials: 3 large typographic quotes, alternating alignment
- Join CTA: full-bleed electric blue section, oversized watermark type, email capture form with inline success state (frontend-only, MOCKED — no email actually sent)
- Footer: locations, social links, giant outline wordmark
- Global grain overlay (SVG noise, mix-blend-overlay), blue selection color, reduced-motion support
- data-testid attributes on all interactive elements
- index.html title/meta updated to Synergy branding

## Implemented (2026-08-12, iteration 2)
- Hero background is now a group training VIDEO (Pexels 6740245, HD mp4, autoplay/muted/loop with ref-based play for React muted-attribute quirk), parallax preserved, Unsplash image kept as poster fallback
- Full-screen mobile menu: hamburger toggle, staggered oversized numbered links, join CTA, body scroll lock, closes on navigation
- Weekly class timetable section (#schedule): Mon-Sun grid with visible bone-on-bone grid lines, Forge/Pulse/Ride/Flow slots, dark hover inversion per cell, horizontal scroll on mobile
- Bone (#EDE8DF) contrast sections: Manifesto, Schedule, and Membership Pricing now on bone with inverted palette (charcoal text, #121212/15 borders, .text-outline-dark numerals, blue retained as accent)
- Nav gained a "Schedule" link

## Implemented (2026-08-13, iteration 17 — APP PHASE 1)
- Member authentication (JWT playbook): register/login/logout/me/refresh endpoints, bcrypt hashing, 15-min access + 7-day refresh httpOnly cookies, 5-attempt brute-force lockout, admin seeded on startup, unique email index. CORS locked to the frontend origin for cookie auth
- Member app shell at /app/*: bottom tab bar (Home / Book / Progress / News / Profile) in brand style, slim members header, safe-area padding; marketing Nav/Footer/Cursor hidden on app routes
- Member screens: Login (sign in / create account toggle, error mapping), MemberHome (time-of-day greeting + quick links), Book (real weekly timetable linking out to the GoTeamUp portal, today highlighted), Progress (stat grid placeholders + Apple Health explainer for Phase 3), News (Journal feed), Profile (account details + sign out)
- AuthContext with credentials-include session check; ProtectedRoute with loading/redirect states
- Verified: register → me round-trip, admin login, wrong-password rejection, /app redirect → login → member home, tab navigation (mobile 390px)

## Implemented (2026-08-12, iteration 16)
- Reworked the real Synergy logo for the site identity: extracted the S-blades icon from their original logo, recolored to electric blue tones (#3B4CE0 → #6E82FA luminance map), rebuilt the wordmark as a double stack — "SYNERGY." in Oswald Bold (bone) with blue full stop + "GROUP FITNESS" in letterspaced JetBrains Mono (blue); icon height matched to the type stack
- Outputs: /public/synergy-logo.png (full lockup, transparent) + /public/synergy-mark.png (icon only, used as favicon/apple-touch-icon)
- Applied in Nav, Footer, and Preloader; build script kept at /tmp/build_logo.py (regenerate by re-running)

## Implemented (2026-08-12, iteration 15)
- Bone (#EDE8DF) contrast sections beyond the homepage, per user request: Team page profiles ("The People Behind The Whistle"), Programs page services grid ("Beyond The Timetable"), News page story grid — all with inverted charcoal text, dark hairline borders, and hover states that flip cards to charcoal with bone text

## Implemented (2026-08-12, iteration 14)
- News section: /news "The Synergy Journal" — featured story card + 5 story grid, all populated with REAL content from synergygroupfitness.co.uk (awards page, community page, member stories, events calendar)
- Post-style detail pages at /news/:slug: category+date kicker, masked headline reveal, full-bleed 21/9 image with blue treatment, excerpt standfirst, body paragraphs, pull quote, back link, CTA. Full bodies for "4x UK Functional Gym Of The Year" and "Motivation Gets You Started. Community Keeps You Going."; member/event stories (Lis Taylor, Run Club, SG3 Nutrition, Drag Queen Bingo) also clickable
- Nav de-cluttered per user feedback: desktop = Programs, Schedule, Team, Teen & Kids, Membership, News, Contact (FAQ moved out); mobile menu holds all 8 incl. FAQ; News added to footer Explore
- Stories data centralised in /app/frontend/src/data/news.js

## Implemented (2026-08-12, iteration 13)
- BUG FIX: FAQ and Teen & Kids were missing from nav (footer-only) — both added to desktop nav and mobile full-screen menu (7 links total, tightened gap); nav testids switched to slug ids (nav-link-kids etc.)

## Implemented (2026-08-12, iteration 12)
- Hero now uses the REAL gym video: user-uploaded desktop clip compressed (audio stripped, H.264 crf26, faststart) to 1.03MB, self-hosted at /videos/synergy-hero-desktop.mp4 with ffmpeg poster /videos/hero-fallback.jpg; MOBILE 9:16 version still pending upload from user (structure ready — will add <source media="(max-width:767px)">)
- Team page: removed the coaches carousel strip (redundant with the fleshed-out profiles); carousel stays on Home
- Contact page: live Google Maps embed for the Leith studio (grayscale → colour on hover, blue corner bracket, address label chip)

## Implemented (2026-08-12, iteration 11)
- REAL timetable from their GoTeamUp listing: SG3 (Mon 07:00/12:00/17:50/18:50, Wed 06:15/12:00/18:00, Sat 08:00/09:00, Sun 09:00), Synergy SWEAT (Tue 06:15, Wed 19:00), SG3 Strength (Thu 06:15/19:00), SG3 CV (Thu 18:00), Open Gym slots Mon-Thu, Fri = Rest & Recovery; SG3 family highlighted blue
- Programs renamed to real classes: SG3 Strength (Ross), Synergy SWEAT (Bev), SG3 CV (Jonny), SG3 signature (Amy) — modals updated with real times/coaches
- Teen & Kids page (/kids): "Strong Starts Here." header, two real youth photos with blue treatment, three parent-focused pillars (Safe & Supported / Confidence First / Genuinely Fun), enquire CTA → /contact; linked in footer + Programs page services card
- Team page fleshed out: "Meet Them Properly" — per-coach editorial profiles with real bios and expandable "Off The Record" fun facts from the actual site (Ross: Argentina/cucumber; Bev: ice cream/Elvis/gymnast; Jonny: LOTR/Partridge/trumpet; Amy; Connor boxing)
- PENDING: new hero videos — user provided truncated URLs (d30...8bc.mp4 / 66c...aa8.mp4) from another agent's job (0af37c53...) — they 403 and aren't in this job's assets. Need re-upload or full URLs. Plan once received: download, strip audio + compress via ffmpeg to ~2-4MB, self-host in /app/frontend/public/videos/, poster via ffmpeg still, responsive <source media="(max-width:767px)"> for 9:16 mobile, keep masked reveal + left-weighted overlay

## Implemented (2026-08-12, iteration 10)
- Members gallery ("Real People. Real Work.") on Home between Testimonials and CTA: 5 user-uploaded member/action photos in a horizontal snap-scroll strip with arrows, same blue-tint treatment as Facilities (blue colour overlay lifting on hover, corner bracket, index numeral, caption)
- BUG FIX: Facilities "The Floor" frame looked off — was a 4/3 crop floating with a negative-margin overlap; now a clean wide 16/9 frame centred on its own row (col-span-6 col-start-4, no overlap)

## Implemented (2026-08-12, iteration 9)
- Real gym photography throughout (5 user-uploaded shots, customer-assets CDN):
  - Facilities rebuilt as a 3-frame asymmetric gallery — "The Engine Room" (blue-lit cardio, wide), "The Rig" (tall, parallax), "The Floor" (dumbbells) — all with a consistent treatment: blue colour-tint overlay (mix-blend-color) that lifts on hover + scale, blue corner bracket, mono caption label, blue index numeral
  - New full-bleed ParallaxBand on Home (dark rig shot, blue tint, "Results-Based Group Fitness" headline)
  - Hero video poster swapped to the real wide gym-floor shot
- All facility images verified loading

## Implemented (2026-08-12, iteration 8)
- Real pricing (GBP) from the business: Free Trial (£0/7 days), Synergy Plus (£88/mo rolling — timetable + open gym + MySynergyCoach app + SG3 nutrition), PAYG & Passes (£8/day Hussle, 10 Class Pass no expiry, PAYG singles)
- Membership page header updated with real "£88/month rolling, no joining fee" copy; pricing header carries "Rolling monthly. No joining fee. No 12-month contracts."

## Implemented (2026-08-12, iteration 7 — FULL SITE)
- Multi-page site with react-router: Home, Programs (/programs), Schedule (/schedule), Team (/team), Membership (/membership), Contact (/contact), FAQ (/faq), Privacy (/privacy) — shared Nav (router-aware with active states), Footer (Explore links + privacy/FAQ), Cursor, grain, Lenis with scroll-to-top on route change
- PageHeader component: masked line reveal on every page
- Programs page: full program breakdowns (modal) + "Beyond The Timetable" services grid (PT, Teens & Kids, Private groups, SG3 nutrition)
- Schedule page: timetable + app booking explainer with store badges
- Team page: coaches strip + "By Your Side. Every Session." ethos block
- Membership page: pricing (indicative note) + "Synergy Promises" bone strip (no joining fee / no 12-month contracts / PAYG welcome — from real FAQ)
- Contact page: working form → POST /api/leads (source=contact), Leith studio card with Google Maps link, second studio card (address shared at booking), app badges
- FAQ page: 12 real FAQs from synergygroupfitness.co.uk as a custom accordion
- Privacy page: 6-section plain-English policy
- Backend: Lead model + POST /api/leads (MongoDB), GET /api/leads protected by x-admin-key header; Resend email integration coded (team notification + user confirmation HTML emails, asyncio.to_thread non-blocking) — ACTIVATES once RESEND_API_KEY is added to backend/.env (PENDING from user); without it, emails are skipped and logged
- CTA trial form now posts to /api/leads (source=free_trial) with loading + error states

## Implemented (2026-08-12, iteration 6)
- App download badges (AppBadges component in CTA.jsx): real App Store + Google Play links for the Synergy app, shown in the Join/CTA section (dark badges on blue) and in the footer "Get The App" block (light badges on charcoal)

## Implemented (2026-08-12, iteration 5)
- Team section rebuilt as a horizontally scrollable snap-strip (all 5 real coaches) with prev/next arrow buttons, edge-disabled states, hidden scrollbar, per-card scroll reveal
- Real team photos uploaded by user now used: Ross (ross.png), Amy (amy.png), Bev (bev.png), Jonny (jonny.png), Connor (conner.png) — hosted via customer-assets CDN URLs
- Added Jonny Jones (PT/Group Coach — S&C sports performance, rehab, intro to lifting) and Connor Friary (PT/Group Coach — Applied Sport & Exercise Science, competitive amateur boxer)

## Implemented (2026-08-12, iteration 4)
- Custom cursor (Cursor.jsx): dot + spring-lagged ring, mix-blend-difference; grows on any interactive hover, morphs into blue labelled pills via data-cursor="view|book|join"; hidden on touch/reduced-motion; native cursor suppressed via .has-custom-cursor CSS
- Program detail overlays (ProgramModal.jsx): full-screen takeover per program with giant display name, coach bio, duration/capacity/intensity stat band, 4-step sample session timeline, results list, "Book a Free Trial" CTA; Esc/backdrop-close, Lenis stop/start while open
- Content aligned to the REAL Synergy Group Fitness (synergygroupfitness.co.uk, Leith, Edinburgh):
  - Programs renamed to real offerings: Forge (S&C / Ross Paterson), Pulse (functional conditioning / Bev Paterson), Perform (sports performance & HYROX / Jonny Jones), Restore (mobility & rehab / Amy Toolis); Schedule renamed Ride→Perform, Flow→Restore
  - Coaches = real team: Ross Paterson (Owner/Head Coach), Amy Toolis (2x UK PT of the Year), Bev Paterson (Partner/Coach)
  - Facilities stats now real awards: 4x UK Functional Gym of the Year, 2x UK PT of the Year, EH6 Leith Edinburgh
  - Testimonials = real member quotes (Leigh McIntyre, Amanda Williams, Paul Cooper)
  - Programs heading uses real tagline "Strength. Fitness. Community."; testimonials kicker "More Than Just A Gym"; marquee updated with real taglines
  - CTA aligned to real offer: FREE 7-day trial; footer address = 35 West Bowling Green Street, Leith, Edinburgh EH6 5NX, #morethanjustagym
  - Hero kicker "Leith, Edinburgh"; pricing tier 1 tied to free trial

## Implemented (2026-08-12, iteration 3)
- Cinematic preloader: eased 0-100% count-up, outline tagline, blue progress bar, slides up on completion; hero/nav reveals gated behind it; body scroll locked during load
- Hero video visibility increased (overlays lightened from black/45 to black/25, gradient via /70→/45) with legibility preserved
- Hero variant switcher (bottom-center pill, testids hero-variant-1/2/3): 01 Full-Bleed (default, current design), 02 Split (typography left, tall parallax video frame right with "LIVE / GROUP FLOOR" label), 03 Overlap (giant outline type over centered vertical video strip); AnimatePresence transitions between variants
- Fixed manifesto 02 alignment: even chapters number-left/content-right, odd chapter content-left/number-right via explicit grid col-start + order classes

## Verification
- Preloader: confirmed count-up to 100% and exit; hero variant switching confirmed for all 3 layouts via clicks + screenshots
- Manifesto 02 alignment verified via screenshot

## Verification (earlier)
- Screenshots confirmed: hero, manifesto, coaches, facilities, pricing, CTA all render correctly at 1920x800
- Join form tested end-to-end via Playwright: success message appears
- No console errors (only a benign emergent-main.js warning)

## Backlog / Next Tasks
- P0: Wire join form to backend (save leads to MongoDB) or Resend email notification
- P1: Host hero video on own CDN/object storage for full control (currently Pexels hotlink)
- P2: Per-program detail overlays/pages with coach + schedule info
- P2: Custom cursor and magnetic button micro-interactions
- P2: Let visitors pick a default hero variant (persist choice)

## Credentials
None — no auth in this app. /app/memory/test_credentials.md intentionally empty.
