# HymnDesk — Claude Code Development Guide

This file is the permanent development reference for AI-assisted sessions.
Read this before writing any code, making any architectural decision, or running any deployment command.

---

## What HymnDesk Is

HymnDesk is a multi-platform worship software product used by worship leaders, choir directors,
musicians, and congregations. It provides hymn library access, service planning, dual-screen
projection, pitch pipe, solfa notation, and repertoire management.

It currently has a large active user base accessing it daily at **hymndesk.co.za**.
Every change made during development must protect those users and their data.

---

## Product Family

| Product | Platform | Framework |
|---|---|---|
| HymnDesk Web | Browser PWA | Vite + React (apps/web/) |
| HymnDesk Mobile Android | Android phone/tablet | React Native + Expo (apps/mobile/) |
| HymnDesk Mobile iOS | iPhone/iPad | React Native + Expo (apps/mobile/) |
| HymnDesk Desktop Windows | Windows 10/11 | Tauri v2 (apps/desktop/) |
| HymnDesk Desktop macOS | macOS 12+ | Tauri v2 (apps/desktop/) |
| HymnDesk Administration | Browser (separate origin) | Vite + React (apps/admin/) |

---

## Repository Structure

```
hymndesk/
├── index.html          ← PRODUCTION web app (Phase 1–2 monolith, do not break)
├── admin.html          ← PRODUCTION admin (do not break)
├── sw.js               ← PRODUCTION service worker
├── manifest.json       ← PRODUCTION PWA manifest
├── style.css           ← PRODUCTION styles
├── hymns.json          ← PRODUCTION hymn content (3.4 MB)
├── solfa-converter.html← PRODUCTION tool
├── CNAME               ← hymndesk.co.za
│
├── apps/
│   ├── web/            ← New Vite PWA (Phase 2 replacement for root index.html)
│   ├── mobile/         ← React Native + Expo (Phase 3)
│   ├── desktop/        ← Tauri v2 (Phase 2)
│   └── admin/          ← Separate secured admin app (Phase 2)
│
├── packages/
│   ├── types/          ← Shared TypeScript interfaces
│   ├── domain/         ← Core entities and pure functions
│   ├── api-client/     ← Repository implementations (Supabase)
│   ├── auth/           ← Token management
│   ├── sync/           ← SyncEngine
│   ├── search/         ← Hymn search logic
│   ├── hymn-engine/    ← Solfa, verse structure, key transposition
│   ├── projection/     ← ProjectionDomain + adapter interfaces
│   ├── design-tokens/  ← CSS tokens, spacing, type scale
│   └── i18n/           ← Shared string keys
│
└── docs/
    ├── MIGRATION_LEDGER.md   ← Feature tracking — READ BEFORE TOUCHING FEATURES
    └── architecture/
        └── decisions/        ← ADR-001 through ADR-010+
```

---

## Approved Technologies

| Layer | Technology | Notes |
|---|---|---|
| Mobile | React Native + Expo | Development builds required (not Expo Go) |
| Desktop | Tauri v2 | Rust backend + WebView frontend |
| Web app | Vite + React + TypeScript | Progressive replacement of monolith |
| Backend | Supabase | Behind repository interfaces — not embedded in UI |
| Local DB (mobile/desktop) | SQLite (expo-sqlite / rusqlite) | |
| Local DB (web) | IndexedDB via idb-keyval | |
| Secure storage (mobile) | expo-secure-store (Keychain/Keystore) | |
| Secure storage (desktop) | tauri-plugin-stronghold | |
| Monorepo | pnpm workspaces + Turborepo | |
| Build | Vite (web/admin), Metro (mobile), Tauri CLI (desktop) | |
| Testing | Vitest (packages/web), Jest (mobile) | |
| CI/CD | GitHub Actions + EAS Build | |

---

## Prohibited Technologies — NEVER USE THESE

- **Capacitor** — prohibited as mobile architecture (WebView-based)
- **Cordova** — prohibited
- **Ionic** — prohibited
- **WebView as primary mobile UI** — prohibited
- **Packaging index.html as a mobile app** — prohibited
- **Packaging the PWA and submitting it as a native app** — prohibited
- **Electron** — not approved for desktop (Tauri v2 is the decision)

---

## Deployment Responsibility Rule

**IF CLAUDE HAS THE TOOLS, ACCESS AND AUTHORIZATION TO COMPLETE A TECHNICAL TASK,
CLAUDE COMPLETES IT RATHER THAN ASSIGNING IT TO THE OWNER.**

This includes: creating files, moving files, installing packages, configuring tools,
running builds, running tests, fixing failures, committing, pushing, deploying,
creating CI workflows, applying migrations (to staging), configuring environments.

The owner is involved only for:
- Decisions requiring product-owner judgement
- Credentials that require account-owner authentication
- Legal agreements (Apple/Google developer agreements)
- Payment
- Approvals for irreversible production changes

Do NOT respond to technical tasks with instructions like:
- "Now run this command."
- "Open your terminal."
- "Run npm install."
- "Deploy this yourself."

---

## Production Safety Rules

**NEVER:**
- Wipe production data
- Reset the production database to simplify a migration
- Delete production tables and recreate them as a shortcut
- Overwrite production data without a verified migration plan and rollback
- Apply destructive schema migrations to production without explicit owner approval
- Deploy functional changes to production during Phase 0
- Break hymndesk.co.za while restructuring the repository

**BEFORE any significant production data change:**
1. Backup
2. Validate backup
3. Write migration plan
4. Write rollback plan
5. Test on staging
6. Execute on production
7. Post-migration validation

---

## Feature Protection — Migration Ledger

The file `docs/MIGRATION_LEDGER.md` lists every existing HymnDesk feature.

**NEVER silently remove an existing feature during migration.**

Before modifying or removing any existing feature:
1. Check the Migration Ledger
2. If the feature exists, update its status — do not delete it
3. A feature may only be marked RETIRED BY APPROVAL with explicit product-owner confirmation

---

## Security Rules

**NEVER:**
- Store privileged credentials in client code (browser, mobile app, desktop app)
- Store GitHub PAT in localStorage (known issue — Phase 1 security fix)
- Store PayFast credentials in localStorage (known issue — Phase 1 security fix)
- Use client-side authorization checks as the sole security mechanism
- Put secrets in source code, logs, documentation, screenshots, git commits, or PR descriptions
- Print credential values in any output (only describe credential types)
- Embed Supabase service role key in any client application

**Credential storage by platform:**
- iOS: Keychain via expo-secure-store
- Android: Keystore via expo-secure-store
- Desktop: tauri-plugin-stronghold
- Web: sessionStorage or httpOnly cookie (not localStorage for auth tokens)

**Known security issues pending Phase 1 remediation:**
1. GitHub PAT in localStorage key `lh_gh_token` (index.html lines 5141–5142)
   Used by exportAndPublish() to push hymns.json to the main branch via GitHub API.
   Has repository write access. Replacement: Supabase Edge Function holds PAT server-side.
2. Admin auth uses server-side bcrypt RPC `verify_admin_password` (NOT client-side SHA-256 —
   the SHA-256 _hashPwd() function at ~line 2037 is dead code, never called). Current risk:
   sessionStorage key `lh_admin_auth` can be set via DevTools to unlock UI-only controls,
   but server-side RPCs still enforce auth. Phase 1 target: migrate to Supabase Auth.
3. PayFast credentials in localStorage keys `pf_merchant_id`, `pf_merchant_key`,
   `pf_passphrase`, `pf_item_name`, `pf_return_url`, `pf_cancel_url` (index.html ~5447–5516).
   No server-side ITN handler. No signature implementation. Replacement: Edge Function.

---

## Architecture Rules

### Domain packages
- Platform applications import from shared packages
- Shared packages do NOT import from platform applications
- Domain logic does NOT depend on Supabase URL structures
- All backend access goes through repository interfaces (packages/api-client)
- Raw Supabase queries do NOT appear in UI components

### Projection
- ProjectionDomain is a platform-agnostic state machine
- BroadcastChannel is the WebProjectionAdapter (web only)
- Desktop uses TauriProjectionAdapter (Tauri IPC)
- Never check `typeof BroadcastChannel !== 'undefined'` in domain code

### Offline
- Core worship functions work offline after content sync
- Sync failures are queued, not shown as blocking errors
- Projection operates from local data — Supabase outage must not stop a service

### Authentication (pending Phase 1)
- Current system uses custom SHA-256 RPCs (login_user, register_user)
- Migration to Supabase Auth is approved but NOT yet executed
- Do NOT execute auth migration without owner approval after staging validation

---

## Design Rules

**Prohibited design patterns:**
- Gradient primary buttons
- Gradient secondary buttons
- Gradient navigation
- Gradient cards
- Emoji as interface icons
- Generic coloured rounded-square icon tiles
- Glassmorphism
- Neon glow
- Decorative blobs
- Cards inside cards
- Every section inside a card
- Generic SaaS/dashboard/AI appearance
- Oversized marketing headlines inside operational software

**Required:**
- Hymn content is the visual hero
- Orange (#E8650A) used only for: primary action, selection, active state
- Playfair Display for hymn titles and reading experiences
- Inter for all operational UI
- Both light and dark themes must work
- Minimum 16px side gutter at any viewport width

---

## GitHub Pages and Production Deployment

**Current state:** GitHub Pages serves `main` branch root.
- index.html, sw.js, manifest.json, style.css, hymns.json, CNAME live at root
- Do not move these files until a proper CI build pipeline replaces root-file serving

**Phase 2+ deployment:** A GitHub Actions workflow will build apps/web/ and deploy
the output to a gh-pages branch. Only then should the production files be moved
out of the repository root.

---

## ADR Requirement

Architectural decisions must not silently reverse an approved ADR.
ADRs live in `docs/architecture/decisions/`.
Before reversing or amending an ADR, create a new superseding ADR.

---

## Documentation Requirement

When implementation changes architecture:
- Update the corresponding ADR
- Update CLAUDE.md if platform or technology decisions changed
- Update docs/MIGRATION_LEDGER.md for every feature affected

Architecture documentation and code must be consistent. If they diverge, the code is
wrong or the documentation is wrong — neither is acceptable.

---

## Migration Phases

| Phase | Goal | Production impact |
|---|---|---|
| Phase 0 | Monorepo foundation, tooling, docs, CI | None |
| Phase 1 | Security fixes + domain extraction | Security fixes applied; no functional changes for users |
| Phase 2 | Web refactor + desktop beta + admin separation | Incremental; feature parity verified before switching |
| Phase 3 | Mobile launch (React Native + Expo) | New apps — no web risk |
| Phase 4 | Content versioning + RBAC + delta sync | Schema migration with staging validation |

Do not begin Phase 1 without explicit owner approval.
Do not begin Phase 2 without Phase 1 exit criteria met.
