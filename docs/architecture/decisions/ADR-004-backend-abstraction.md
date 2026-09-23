# ADR-004: Backend Abstraction

**Status:** Accepted  
**Date:** 2026-09-23  

## Decision

All backend access goes through **repository interfaces** defined in `packages/api-client`. Platform applications and domain packages do not contain raw Supabase queries or depend on Supabase URL structures.

```
Platform App → Domain → Repository Interface → Supabase Implementation
```

## Repository interfaces

`AuthRepository`, `HymnRepository`, `RepertoireRepository`, `ServicePlanRepository`, `UserLibraryRepository`, `ContentRepository`, `SyncRepository`, `AnalyticsService`, `NotificationService`

## Rationale

Supabase is the current backend. It may not always be. Repository interfaces allow the backend implementation to change without rewriting UI or domain code.

## Consequences

- Supabase client is imported only in `packages/api-client`, not in apps or other packages
- Credentials (URL, anon key) are injected via environment configuration, not hardcoded
- Service role key exists only in Edge Functions, never in client code
