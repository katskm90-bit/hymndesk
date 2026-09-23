# HymnDesk Database Documentation

## Supabase Projects

| Project | ID | Status | Purpose |
|---|---|---|---|
| hymndesk-sync | qszwtpoqvnjstsbihrkv | INACTIVE (paused) | **HymnDesk PWA production backend** — login_user, register_user, repertoires, sync |
| hymndesk-control | ehhpdpmzhrpgbgjnlkwu | ACTIVE_HEALTHY | Serenza Deluxe Atelier choir management (separate product) |

**IMPORTANT:** `hymndesk-sync` is the production database for the HymnDesk web app at
hymndesk.co.za. It is currently PAUSED on the Supabase free plan. All authenticated
features (login, registration, repertoires, service plans, favourites, sync) are
unavailable to users until it is restored.

## Production URL

The live application uses: `https://qszwtpoqvnjstsbihrkv.supabase.co`

The anon key is embedded in index.html (publicly visible, intended for client-side use).

## Schema Notes (Phase 0)

The `hymndesk-sync` project schema could not be exported during Phase 0 because
the project is INACTIVE. Schema export is a Phase 1 prerequisite — the project
must be restored before the schema can be inspected.

From the index.html source, the following RPCs are known to exist in hymndesk-sync:
- `login_user` — custom SHA-256 password authentication (Phase 1 security fix target)
- `register_user` — user registration (Phase 1 security fix target)
- Additional RPCs inferred from UI: repertoire management, favourites, service plans

See `docs/architecture/decisions/ADR-007-authentication.md` for the auth migration plan.

## Staging Environment

A staging project (`hymndesk-sync` repurposed or a new project) cannot be created
until the Supabase free plan limit (2 active projects) is resolved.

Owner decision required: pause hymndesk-control OR upgrade to Supabase Pro.

See Phase 0 Completion Report for details.
