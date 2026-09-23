# ADR-007: Authentication

**Status:** Accepted (migration to Supabase Auth approved)  
**Date:** 2026-09-23  

## Context

Current system uses custom SHA-256 RPCs (`login_user`, `register_user`). SHA-256 is not salted — vulnerable to rainbow tables. No refresh token rotation. No MFA. No session revocation.

Three critical security issues exist in the current implementation (see ADR-007 security note).

## Decision

**Migrate to Supabase Auth (Option A).**

Existing users must reset their passwords once during the migration window. This is communicated in advance. The migration requires explicit owner approval after staging validation.

## Migration prerequisites (must all be complete before production migration)

1. Current user inventory exported
2. Production database backed up
3. Migration procedure documented
4. Rollback procedure documented
5. User communication plan prepared
6. Password reset flow implemented and tested
7. Staging migration validated
8. Session migration strategy confirmed
9. RLS policies updated for Supabase Auth UIDs
10. Authentication regression tests passing

## Security issues (Phase 1 priority — independent of auth migration)

1. GitHub PAT in localStorage key `lh_gh_token` → Edge Function (immediate)
2. Client-side SHA-256 admin check → server-side rate-limited check (immediate)
3. PayFast credentials in localStorage → Edge Function configuration (immediate)
4. SHA-256 password hashing → bcrypt in `login_user` RPC (Phase 1, before auth migration)

## Consequence

Supabase Auth provides: bcrypt password hashing, refresh token rotation, MFA, social login, magic links, device session management.
