# ADR-003: Local Database

**Status:** Accepted  
**Date:** 2026-09-23  

## Context

All native platform applications require local persistent storage for: hymns, books, languages, lyrics, verses, solfa, favourites, history, repertoires, service plans, sync state, pending writes, and application settings.

The solution must support: offline operation, full-text search, structured queries, and reliable sync state management.

## Decision

**SQLite** is the local database for mobile and desktop applications.

- **Mobile:** `expo-sqlite` (React Native + Expo)
- **Desktop:** `rusqlite` via Tauri Rust backend
- **Web:** `IndexedDB` via `idb-keyval` (SQLite is not available in browsers)

Credentials are **not** stored in SQLite. Platform-secure storage is used:
- Mobile: `expo-secure-store` (Keychain/Keystore)
- Desktop: `tauri-plugin-stronghold`
- Web: `sessionStorage` or `httpOnly` cookie

## Rationale

- SQLite is the industry standard for local-first mobile and desktop storage
- `expo-sqlite` in Expo SDK 50+ supports synchronous reads and full-text search (FTS5)
- FTS5 virtual tables provide fast full-text hymn search without a server round trip
- SQLite is battle-tested for multi-million-row datasets (the hymn catalogue is ~59K rows)

## Schema (Phase 3 implementation)

Core tables: `hymns`, `hymn_books`, `languages`, `verses`, `chorus`, `solfa_content`, `favourites`, `history`, `repertoires`, `repertoire_items`, `service_plans`, `pending_writes`, `sync_checkpoints`, `app_settings`.

FTS5 virtual table: `hymns_fts` over `(title, search_normalized, verse_text)`.

## Consequences

- Local database is populated on first launch from the hymns.json content sync
- FTS5 index is built during initial sync (acceptable delay: shown as progress)
- Incremental updates to FTS index on content delta sync (Phase 2+)
- localStorage is not used for persistent app data on any platform
