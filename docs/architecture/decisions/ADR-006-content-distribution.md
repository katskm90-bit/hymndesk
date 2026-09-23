# ADR-006: Hymn Content Distribution

**Status:** Accepted (Phase 1 path); Phase 2 path pending implementation approval  
**Date:** 2026-09-23  

## Decision

**Phase 1:** hymns.json at hymndesk.co.za, served via Cloudflare CDN with ETag caching. Publish mechanism moves from client-side GitHub PAT to a server-side Edge Function (`publish-hymns`).

**Phase 2 (approved in principle):** Versioned delta sync. Clients store a local SQLite snapshot and receive incremental diffs from a `content-delta` Edge Function. Trigger: first-load time >5s on 3G or file size >6 MB.

## Phase 2 migration path

```
hymns.json → Validation → Canonical content model → Supabase → content-delta → Client SQLite
```

## Consequence of Phase 1

The 3.4 MB hymns.json continues to be the content source. The service worker's stale-while-revalidate strategy means repeat loads are near-instant. First load on slow connections is the known bottleneck.
