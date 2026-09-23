# ADR-005: Sync Architecture

**Status:** Accepted  
**Date:** 2026-09-23  

## Decision

A dedicated **SyncEngine** in `packages/sync` handles all data synchronisation. No Supabase calls are scattered in UI components.

## SyncEngine contract

- **Local-first writes:** all writes go to local storage first, then queue for server sync
- **Pending write queue:** persisted across app restarts
- **Retry:** exponential backoff (initial 2s, max 5 min)
- **Connectivity restoration:** queue flushed when network returns
- **Conflict resolution:** last-write-wins with server timestamp (content edits require explicit resolution)
- **Soft deletion:** records marked deleted, not removed, until server confirms
- **Sync checkpoints:** last successful sync timestamp per entity type
- **Visible sync state:** UI shows sync status; failures are visible

## Critical constraint

Projection must operate from local data only. The SyncEngine must not block or interrupt a live presentation session.

## Source location (current monolith)

`index.html` lines ~2219–2970 contain the current sync implementation. This is extracted to `packages/sync` in Phase 1.
