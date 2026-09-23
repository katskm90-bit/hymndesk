# HymnDesk Migration Ledger

This ledger records every existing HymnDesk feature and tracks its migration status across all platforms.

**Rules:**
- No feature may be marked RETIRED BY APPROVAL without explicit product-owner confirmation
- Status must be updated in the same commit as any implementation change
- Every feature migrated must have tests passing before status is changed to VERIFIED

**Status values:**
`NOT STARTED` · `DOCUMENTED` · `EXTRACTED` · `IMPLEMENTED` · `TESTING` · `VERIFIED` · `REPLACED` · `RETIRED BY APPROVAL`

---

## How to read this ledger

| Column | Meaning |
|---|---|
| Feature | Descriptive name |
| Source | File and approximate line range in the current monolith |
| Target package | Where the domain logic should live after extraction |
| Web | Status in apps/web (new Vite app) |
| Mobile | Status in apps/mobile |
| Tablet | Status in apps/mobile (tablet layout) |
| Desktop | Status in apps/desktop |
| Admin | Status in apps/admin |
| Tests | Whether tests exist for this feature |
| Notes | Important context |

---

## Hymn Library

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Hymn catalogue loading (hymns.json) | index.html ~load() | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | 3.4 MB JSON; ETag-cached via SW; Phase 2 replaces with delta sync |
| Hymn book browser (home grid) | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Book cards with hymn count, language tag |
| Hymn card grid | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Grid view per book |
| Hymn number search | index.html | packages/search | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Exact and partial number lookup |
| Hymn title search | index.html | packages/search | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Prefix and full-text |
| Lyrics search | index.html | packages/search | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Full-text across all verses |
| Language filter | index.html | packages/search | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Filter by language code |
| Book filter | index.html | packages/search | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Filter within a book |
| Global search bar | index.html | packages/search | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Single unified search across all books |
| Search normalisation (diacritics) | index.html | packages/domain (search-normalize.ts) | EXTRACTED | EXTRACTED | EXTRACTED | EXTRACTED | — | NOT STARTED | `normalizeForSearch` extracted to packages/domain |
| Recently viewed hymns | index.html | packages/api-client / local DB | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | localStorage key `lh_history` currently |
| Favourite hymns | index.html | packages/api-client / local DB | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | localStorage key `lh_items` currently |
| Favourite filter toggle | index.html | — | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Filter hymn list to favourites only |
| Hymn QR code | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | QR for hymn sharing |
| Hymn sharing | index.html | — | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Share hymn info |
| Hymn edit (user-level) | index.html | packages/api-client | NOT STARTED | — | — | NOT STARTED | NOT STARTED | NOT STARTED | Admin: full edit; user: limited edit |
| Hymn delete | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Admin only |
| Hymn create/add | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Admin only |

---

## Hymn Reading

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Hymn detail view | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Full hymn with all verses |
| Verse navigation | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Previous/next verse |
| Verse display with chorus interleaving | index.html | packages/domain (getVerseSequence) | EXTRACTED | EXTRACTED | EXTRACTED | EXTRACTED | — | NOT STARTED | Extracted to packages/domain |
| Multi-language display | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Side-by-side or stacked language rows |
| Key signature display | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Per repertoire item |
| Tempo display | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | BPM per repertoire item |
| Cue notes / cue banner | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Colour-coded cue at verse top in projection |
| Composer / author display | index.html | packages/types | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Metadata display |
| Audio playback | index.html | packages/hymn-engine | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Audio refs from hymn content |
| Video references | index.html | packages/hymn-engine | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Video ref display and launch |
| YouTube float player | index.html | — | NOT STARTED | — | NOT STARTED | NOT STARTED | — | NOT STARTED | Draggable floating YT iframe (web/desktop) |
| Media reference display | index.html | packages/types | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Audio/video ref list |
| Reading view (full-screen reading mode) | index.html ~8713–8897 | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Auto-advancing reading slides |
| Reading auto-advance timer | index.html ~10264–10271 | — | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Configurable auto-advance |

---

## Solfa Notation

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Solfa display grid | index.html | packages/hymn-engine | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Bar/beat grid per voice part |
| Solfa parser (text → structured) | index.html ~3810–3877 | packages/hymn-engine | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Parse solfa notation strings |
| Solfa in projection | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Solfa mode during presentation |
| Solfa converter tool | solfa-converter.html | packages/hymn-engine | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Standalone conversion tool |
| Repeat sections / verse structure | index.html | packages/hymn-engine | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Verse/chorus repeat configuration |

---

## Pitch Pipe

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Pitch pipe synthesiser | index.html ~11340–11521 | packages/hymn-engine | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Web Audio API (web), expo-av (mobile), Tauri audio (desktop) |
| Pitch pipe grid (note buttons) | index.html | — | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | UI: all 12 semitones |
| Note sustain / release | index.html | packages/hymn-engine | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | `playPitchNote` / `stopPitchNote` |
| Stop all notes | index.html | packages/hymn-engine | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | `stopAllPitchNotes` |

---

## Tempo

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Tap tempo | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | BPM calculation from tap intervals |
| BPM display | index.html | — | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | |

---

## Repertoires

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Repertoire list | index.html | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | localStorage key `lh_reps` currently |
| Repertoire create | index.html | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | |
| Repertoire edit (rename) | index.html | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | |
| Repertoire delete | index.html | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | |
| Add hymn to repertoire | index.html | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | |
| Reorder repertoire items | index.html | packages/domain (reorderItem) | EXTRACTED | EXTRACTED | EXTRACTED | EXTRACTED | — | NOT STARTED | Drag handles; extracted to packages/domain |
| Remove item from repertoire | index.html | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | |
| Add segment/announcement item | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Non-hymn service items |
| Key signature per item | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Per-item key selection |
| Repeat configuration per item | index.html | packages/domain | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Which verses to sing and how many times |
| Shared repertoires | index.html | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Share via token; read by others |
| Repertoire QR code | index.html | — | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | QR share link |
| Import shared repertoire | index.html | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | `saveSharedRep` / `getSharedReps` Supabase RPCs |
| Service history | index.html | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Past service records |

---

## Projection

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Start projection | index.html ~3886–4229 | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Builds sequence, opens projection view |
| Build presentation sequence | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Converts repertoire items to slide sequence |
| Show hymn verse slide | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | `renderSlide`, `showSegmentSlide` |
| Next / previous slide | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Keyboard and button navigation |
| Show custom segment slide | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Non-hymn items |
| Show announcement slide | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | |
| Multi-language projection | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Side-by-side or stacked language rows |
| Projection background cycle | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | `cycleProjBg`: black, navy, purple, vignette, carbon |
| Fullscreen toggle | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Browser/Tauri fullscreen |
| Projection font size controls | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Scale up/down |
| Dual-screen (BroadcastChannel) | index.html | packages/projection (WebProjectionAdapter) | NOT STARTED | — | — | — | — | NOT STARTED | Current mechanism; becomes web adapter |
| Voice commands (Web Speech API) | index.html | packages/projection | NOT STARTED | — | — | — | — | NOT STARTED | Next/prev/specific verse by voice |
| Cue notes in projection | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Leader cue banner at top of slide |
| Operator notes | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Visible to operator only |
| Divider / "up next" slide | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Between service items |
| Key display on divider | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Shows key of next hymn |
| Solfa mode in projection | index.html | packages/projection | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Toggle solfa display in projection |
| BroadcastChannel inter-tab | index.html ~1906–1986 | packages/projection (WebProjectionAdapter) | NOT STARTED | — | — | — | — | NOT STARTED | Tab-to-tab dual screen; web only |

---

## Export and Import

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PDF export | index.html ~7597–7820 | packages/domain | NOT STARTED | — | — | NOT STARTED | NOT STARTED | NOT STARTED | `_exportPDF`; uses browser print on web |
| PowerPoint export | index.html ~7597–7820 | packages/domain | NOT STARTED | — | — | NOT STARTED | NOT STARTED | NOT STARTED | `_exportPPTX` using PptxGenJS CDN |
| CSV import (hymns) | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Admin only |
| JSON export | index.html | — | NOT STARTED | — | — | NOT STARTED | — | NOT STARTED | Export hymn/repertoire data |
| GitHub publish (hymns.json) | index.html ~5193–5291 | Edge Function (Phase 1 security fix) | NOT STARTED | — | — | — | NOT STARTED | NOT STARTED | Currently uses PAT from localStorage — SECURITY ISSUE |

---

## Authentication

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Login | index.html (gasCall login) | packages/auth | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | SHA-256 RPC currently; Phase 1: bcrypt; Phase 2: Supabase Auth |
| Register | index.html (gasCall register) | packages/auth | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | |
| Forgot password | index.html (gasCall forgotPassword) | packages/auth | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | |
| Reset password | index.html (gasCall resetPassword) | packages/auth | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | |
| Update profile | index.html (gasCall updateProfile) | packages/auth | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | |
| Admin password check | index.html ~2037–2120 | packages/auth → Edge Function | NOT STARTED | — | — | — | NOT STARTED | NOT STARTED | SECURITY ISSUE: client-side SHA-256 check; Phase 1 fix required |
| Secure token storage | index.html (localStorage) | packages/auth | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | Currently localStorage; Phase 1: platform-secure storage |

---

## Sync / Cloud

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Snapshot / diff sync engine | index.html ~2219–2970 | packages/sync | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Local-first writes, pending queue, retry |
| Background sync (service worker) | sw.js | packages/sync | NOT STARTED | NOT STARTED | NOT STARTED | — | — | NOT STARTED | `hymndesk-sync` tag triggers flush |
| Periodic hymn refresh | sw.js | packages/sync | NOT STARTED | NOT STARTED | NOT STARTED | — | — | NOT STARTED | `hymndesk-hymn-refresh` periodic sync tag |
| Sync banner / status indicator | index.html | — | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | `#sync-banner` showing sync in progress |
| Offline operation | index.html + sw.js | packages/sync | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Core function: all worship features offline |

---

## Hymn of the Day

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Hymn of the Day scheduling | index.html ~9245–9582 | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | Date-based hymn selection |
| HOTD notification | index.html | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Push notification for daily hymn |

---

## Payments / Support

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| PayFast payment integration | index.html ~1459–1496 | Edge Function (Phase 1 security fix) | NOT STARTED | — | — | — | — | NOT STARTED | SECURITY ISSUE: credentials in localStorage; Phase 1 fix required |
| Support/donation flow | index.html | — | NOT STARTED | — | — | — | — | NOT STARTED | Links to payment gateway |

---

## Analytics / Feedback

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Usage tracking | index.html (gasCall trackUsage) | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | `app_usage_events` table |
| User feedback submission | index.html (gasCall userFeedback) | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Feedback FAB |
| Star rating | index.html (gasCall submitRating) | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Per-hymn star rating |
| Ad enquiry form | index.html (gasCall adEnquiry) | packages/api-client | NOT STARTED | — | — | — | NOT STARTED | NOT STARTED | |
| Feedback inbox | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Admin only |
| Ratings inbox | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Admin only |
| Ad enquiries inbox | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Admin only |

---

## Administration

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Analytics dashboard | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Usage, user counts, trending hymns |
| User management | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | List, search, role change, disable |
| Hymn editor | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Full hymn create/edit with verse editor |
| Book management | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Add/edit hymn books |
| Banner management | admin.html | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Homepage banner slides |
| Stats dashboard | admin.html (gasCall stats) | packages/api-client | — | — | — | — | NOT STARTED | NOT STARTED | Platform-wide statistics |

---

## PWA / Infrastructure

| Feature | Source | Target package | Web | Mobile | Tablet | Desktop | Admin | Tests | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Service worker (offline caching) | sw.js | — | NOT STARTED | — | — | — | — | NOT STARTED | Cache names v18/v7; retain and increment |
| PWA install (manifest) | manifest.json | — | NOT STARTED | — | — | — | — | NOT STARTED | Preserve install behaviour |
| Push notifications skeleton | sw.js | packages/api-client | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | Push handler exists in SW |
| Dark mode | index.html (`html.dark`) | packages/design-tokens | DOCUMENTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | `html.dark` class toggle currently; tokens extracted |
| Theme persistence | index.html | — | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | — | NOT STARTED | localStorage `lh_theme` |
| Responsive layout | index.html | — | NOT STARTED | — | — | — | — | NOT STARTED | 480px / 768px breakpoints |

---

## Legend

| Symbol | Meaning |
|---|---|
| NOT STARTED | Feature exists in monolith; not yet migrated |
| DOCUMENTED | Requirements documented; implementation not started |
| EXTRACTED | Logic moved to a shared package; not yet wired into platform app |
| IMPLEMENTED | Working in a platform app (dev/staging) |
| TESTING | Under test |
| VERIFIED | Tests pass; feature confirmed working end-to-end |
| REPLACED | Platform app version confirmed; monolith version retired |
| RETIRED BY APPROVAL | Removed from product; requires explicit owner approval |
| — | Not applicable to this platform |

---

*Last updated: 2026-09-23 (Phase 0 — initial population from source audit)*
