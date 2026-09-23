# Supabase Auth Migration Plan

**Status:** Design approved (D-2). Implementation requires explicit owner approval after staging validation.  
**Date:** 2026-09-23  
**References:** ADR-007, Phase 0 Completion Report, Phase 1 Security Baseline

---

## Current state

HymnDesk uses a custom authentication system built on Supabase RPCs:

| Component | Current implementation |
|---|---|
| Login | `rpc/login_user` — custom password comparison via server-side bcrypt |
| Registration | `rpc/register_user` — custom user creation |
| Admin auth | `rpc/verify_admin_password` — separate bcrypt check with rate limiting |
| Admin elevation | `rpc/drop_admin_elevation` — server-side session flag |
| Logout | `rpc/logout_user` — custom session invalidation |
| Session | Custom token stored in localStorage (implementation detail to verify after hymndesk-sync is restored) |
| Admin session | `sessionStorage` key `lh_admin_auth` |

All of these RPCs live in the `hymndesk-sync` Supabase project (currently INACTIVE).

## Target state

Replace the custom RPC auth system with Supabase Auth (the built-in auth module):

| Component | Target implementation |
|---|---|
| Login | `supabase.auth.signInWithPassword()` |
| Registration | `supabase.auth.signUp()` |
| Admin auth | Supabase Auth + role claim in JWT (`user_metadata.role = 'admin'` or custom claim) |
| Admin elevation | Eliminated — JWT role claim is the authorisation mechanism |
| Logout | `supabase.auth.signOut()` |
| Session | Supabase Auth managed session (httpOnly cookie or secure storage per platform) |
| Password reset | `supabase.auth.resetPasswordForEmail()` (new capability — did not exist before) |

## Prerequisites (ALL must be satisfied before production migration)

These prerequisites are non-negotiable per the D-2 approval conditions:

- [ ] **User inventory**: Export all current user accounts from `hymndesk-sync` with email, role, and created_at. Count total active users.
- [ ] **Backup**: Full database backup of `hymndesk-sync` before any schema change.
- [ ] **Migration plan**: Document which users map to which Supabase Auth accounts. Custom auth users have password hashes — Supabase Auth uses its own hash scheme. Users must reset passwords on first login.
- [ ] **Rollback plan**: If migration fails, RPCs must be restorable and the old auth flow must work. New and old systems must not conflict.
- [ ] **User communication plan**: Email or in-app notice to all users that a login change is coming and they will need to reset their password.
- [ ] **Password reset flow**: Implement `supabase.auth.resetPasswordForEmail()` + email template before migration, since all users will need to reset.
- [ ] **Staging test**: Full auth flow must work on staging before touching production.
- [ ] **Session migration strategy**: What happens to currently logged-in users during the switchover?
- [ ] **RLS validation**: All Row Level Security policies must be tested with Supabase Auth JWTs, not custom tokens.
- [ ] **Regression tests**: Every RPC that checks authentication must be tested with the new auth mechanism.

## Migration phases

### Phase 1A — Staging preparation

1. Restore hymndesk-sync (blocked — see Supabase blocker in completion report)
2. Enable Supabase Auth in project settings (does not affect existing custom auth)
3. Create admin role claim mechanism (option A: `user_metadata`, option B: custom JWT claim via auth hook)
4. Export user list from custom `users` table (email, hashed password, role, created_at)
5. Create migration script that creates Supabase Auth accounts for all existing users
   - Password cannot be migrated (different hash scheme) — all users will get temporary "requires password reset" state
   - Map custom `users.id` to Supabase Auth `auth.users.id` where possible
6. Implement password reset email flow

### Phase 1B — Parallel auth (staging only)

Run both auth systems simultaneously on staging:
- New login path uses `supabase.auth.signInWithPassword()`
- Old login path preserved as fallback
- Test RLS policies with both auth mechanisms

### Phase 1C — Production cutover

Owner must explicitly approve after:
- All prerequisites checked off
- Staging validation complete
- User communication sent
- Rollback procedure documented and tested

Cutover:
1. Enable Supabase Auth on production
2. Run user migration script (creates Supabase Auth accounts, forces password reset)
3. Deploy updated frontend that uses Supabase Auth
4. Monitor error rates for 48 hours
5. After validation: remove old RPC auth system

### Phase 1D — Admin auth redesign

Replace `verify_admin_password` RPC with Supabase Auth role claims:

Option A — `user_metadata` role (simpler, Phase 1 target):
- Admin users have `user_metadata: { role: 'admin' }` in Supabase Auth
- RPCs check `auth.jwt()->>'role' = 'admin'`
- Admin access via `supabase.auth.getSession()` — no separate password modal

Option B — Custom JWT claim via auth hook (more robust, Phase 2):
- Auth hook injects `role` claim from a `user_roles` table into every JWT
- RLS policies and RPCs reference `auth.jwt()->'app_metadata'->>'role'`
- Allows role changes without requiring re-login

**Recommended for Phase 1: Option A** (simpler, works immediately, no custom hook required).
**Option B** for Phase 2 when the org model is designed.

## Admin authentication correction

**The Phase 0 report stated admin auth used client-side SHA-256. This was incorrect.**

Admin auth is already server-side bcrypt via `verify_admin_password`. The `_hashPwd()`
SHA-256 function in index.html is dead code. The Phase 1 admin auth work is therefore:

1. Migrate admin users to Supabase Auth (same as regular users)
2. Set admin role claim in `user_metadata` 
3. Remove the `_showAdminPwdModal()` / `_submitAdminPwd()` flow
4. Remove the `sessionStorage` `lh_admin_auth` bypass
5. Replace with a Supabase Auth session check — admin UI renders if `session.user.user_metadata.role === 'admin'`
6. All admin RPCs enforced server-side via JWT role claim

This is NOT implementing "bcrypt" (which is already in place). It is replacing the
custom RPC auth with Supabase Auth to consolidate authentication into a single
standard mechanism.

## What this migration does NOT change

- Hymn content delivery (hymns.json, served as static file)
- Projection system
- Offline functionality
- Repertoire data model (schema adapts, not replaces)
- Any feature not related to authentication

## Dependencies

- hymndesk-sync must be restored (blocked — see Supabase blocker)
- Schema of `users` table must be exported and analysed
- Custom RPCs (`login_user`, `register_user`) must be read before they are replaced
- User count must be established before planning communication

## Owner decisions required before Phase 1C

- Confirmation of admin user list (who gets `role: 'admin'`)
- Approval of user communication message and timing
- Approval of password reset approach (force-reset all, or only warn on next login)
- Confirmation of rollback window (how long to keep old RPCs available as fallback)
