# Synergy App — Scoping Document
### Turning the Synergy website into an iOS/Android app with identical design
Date: 2026-08-12 · Status: Ready to build

---

## 1. Strategy: One Codebase, Wrapped Natively

**Approach: Capacitor wrapper around the existing React app.**

The current site is a React SPA. Capacitor packages it as a real native app
(iOS + Android) while keeping 100% of the design system, components, and
motion language. Native-only features (HealthKit, push) are added via plugins
that bridge into the same React code.

```
┌─────────────────────────────────────────────┐
│  React app (existing site + new app screens) │
│  design tokens, Oswald/Manrope/Mono, Lenis*  │
├─────────────────────────────────────────────┤
│  Capacitor bridge                            │
│  · HealthKit plugin (iOS) / Health Connect   │
│  · Push notifications (FCM/APNs)             │
│  · Secure token storage                      │
├─────────────────────────────────────────────┤
│  FastAPI backend (existing) + MongoDB        │
│  · auth, bookings cache, referrals, progress │
├─────────────────────────────────────────────┤
│  TeamUp API (existing booking system)        │
│  classes, memberships, payments, reserves    │
└─────────────────────────────────────────────┘
```

*Lenis smooth scrolling is disabled inside the app shell — native scroll is
already smooth. Everything else carries over.

**Why not React Native:** doubles the build for zero visual gain — the site's
value is its existing component library.

---

## 2. Feature Scope & Mapping

| Feature | Implementation | Depends on |
|---|---|---|
| Book classes in a few clicks | Timetable screen (exists) → class detail → book/cancel via TeamUp API | TeamUp API access |
| News, offers, events | Journal screens (exist) + CMS: stories move into MongoDB with admin editor | Backend work only |
| Refer a friend | Referral code per member, tracked signups, reward flag for staff | Auth |
| Apple HealthKit | `@capgo/capacitor-health` (iOS) + Health Connect (Android): steps, distance, calories | Capacitor shell |
| Progress tracking | "My Progress" screen: daily steps, weekly calories, class streak, SG3 attendance | HealthKit + auth |
| Push notifications | Class reminders, reserve-list promotion, referral confirmations | Capacitor + FCM/APNs |

---

## 3. Phase Plan

### Phase 1 — App shell + member accounts (foundation)
- Add Capacitor to the existing frontend (`@capacitor/core`, `ios`, `android`)
- Splash screen + app icon from `synergy-mark.png`
- Auth: JWT email/password (member accounts in MongoDB); secure token storage
  via Capacitor Preferences/Keychain
- App navigation: bottom tab bar (Home / Book / Progress / News / Profile)
  styled to the design system — sharp corners, hairline borders, electric
  active state. The marketing site remains reachable but the app defaults
  to member screens
- Effort: ~2-3 focused sessions

### Phase 2 — Booking
- Backend proxy endpoints: `GET /api/classes?week=`, `POST /api/bookings`,
  `DELETE /api/bookings/:id` → TeamUp API (server-side, keys never in app)
- Screens: Week timetable (existing Schedule component restyled as feed),
  class detail (reuse ProgramModal pattern), My Bookings list with
  cancel-within-5-hours rule messaging
- Reserve list state surfaced ("You're 2nd in line — you almost always get in")
- Effort: ~2-3 sessions · BLOCKER: needs TeamUp API key/approval from the
  business's TeamUp account

### Phase 3 — HealthKit + Progress
- iOS: `@capgo/capacitor-health` — request authorization, read steps /
  distance / active calories
- Android: Health Connect equivalent
- "My Progress" screen: big stat numerals (existing stat component), weekly
  bar rhythm, class streak counter, SG3 attendance
- Effort: ~2 sessions

### Phase 4 — Referrals + push + polish
- Referral codes (`/api/referrals`), share sheet, reward tracking
- Push: booking confirmations, reserve promotions, class reminders (T-2h)
- App Store assets, screenshots, review submission
- Effort: ~2 sessions

---

## 4. New Data Models (MongoDB)

```
members:    { id, email, name, teamup_customer_id, referral_code, created_at }
sessions:   JWT-based; token in device secure storage
referrals:  { id, referrer_code, referee_email, status: pending|joined|rewarded }
progress:   { member_id, date, steps, distance_m, calories, classes_attended }
stories:    { id, slug, title, category, date, excerpt, body[], image, published }
```

## 5. New API Endpoints

```
POST /api/auth/register | /api/auth/login        → JWT
GET  /api/classes?week=YYYY-WW                   → TeamUp proxied timetable
POST /api/bookings  DELETE /api/bookings/:id     → TeamUp proxied
GET  /api/me/progress?range=7d                   → HealthKit sync + streaks
POST /api/me/progress                            → device pushes daily stats
GET  /api/me/referral                            → code + link
POST /api/referrals/claim                        → on signup with code
GET  /api/stories  (public)  POST /api/admin/stories (admin-key)
```

---

## 6. Design Token Transfer (zero-drift guarantee)

The tokens already live in this project as portable files:

- **`/app/frontend/src/design-tokens.json`** — full token spec (color, type,
  spacing, motion, effects, component recipes) in W3C-style JSON
- **`/app/frontend/src/design-tokens.css`** — drop-in CSS custom properties
  (`--syn-*`) for any web app

**Using them in the other web app:**
1. Copy `design-tokens.css` into the app's global stylesheet
2. Fonts: single Google Fonts import (in the JSON under `font.import`)
3. Tailwind projects: extend config —
   `colors: { charcoal: '#121212', bone: '#F4F4F0', 'bone-section': '#EDE8DF',
   electric: '#4C63F5' }`,
   `fontFamily: { display: ['Oswald'], body: ['Manrope'], mono: ['JetBrains Mono'] }`
4. Motion: always `cubic-bezier(0.16, 1, 0.3, 1)`, 300ms hover / 800ms reveal
5. Non-negotiables: sharp corners, hairline grids, blue reserved for
   interaction, grain overlay on dark, photo blue-tint treatment

---

## 7. Prerequisites & Accounts Needed

| Item | Who provides | When |
|---|---|---|
| TeamUp API access/key | Business (from their TeamUp account) | Before Phase 2 |
| Apple Developer account (£79/yr) | Business | Before Phase 4 / TestFlight |
| Google Play account ($25 once) | Business | Before Phase 4 |
| Resend API key | You (free, resend.com) | Any time — also unblocks site emails |
| HealthKit capability | Enabled in Xcode project (I handle) | Phase 3 |

## 8. Risks & Notes

- **TeamUp API is the critical path** — booking depth depends on what their
  plan/API permits. Worst case: Phase 2 ships with deep-links into the
  existing GoTeamUp portal, booking native later.
- App Store review requires visible native value: HealthKit + push + booking
  satisfies this comfortably.
- The marketing site and app share one deployment; routes under `/app/*`
  become the member area, marketing pages stay public.
