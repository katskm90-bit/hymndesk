# ADR-002: Desktop Runtime

**Status:** Accepted  
**Date:** 2026-09-23  
**Deciders:** Product owner  

## Context

HymnDesk requires Windows and macOS desktop applications with: multi-window projection, multi-monitor detection, keyboard shortcuts, native file dialogs, automatic updates, and offline operation.

## Decision

**Tauri v2** is the desktop runtime for HymnDesk Desktop.

HymnDesk Desktop is **not** `index.html + Tauri`. The desktop application has its own information architecture designed for keyboard, mouse, and multi-monitor environments.

## Rationale

- Rust backend provides: SQLite (rusqlite), native file system access, secure credential storage (stronghold plugin), global keyboard shortcuts, window state persistence
- The WebView frontend can share React components and TypeScript packages with the web application where appropriate
- Tauri's multi-window API (`WebviewWindow::builder`) handles operator + projector window topology
- Tauri IPC (`invoke`/`emit`) replaces BroadcastChannel for inter-window projection communication
- Binary size is significantly smaller than Electron
- Automatic updates are handled by `tauri-plugin-updater` using GitHub Releases

## Plugins Required

- `tauri-plugin-window-state` — window position/size persistence
- `tauri-plugin-dialog` — native file open/save dialogs
- `tauri-plugin-global-shortcut` — presentation keyboard shortcuts
- `tauri-plugin-stronghold` — secure credential storage
- `tauri-plugin-updater` — automatic background updates
- `tauri-plugin-tray` — system tray presence (Windows)

## Distribution

- Direct download with code-signing (Phase 2 launch)
- macOS: Apple notarisation required ($99/year Apple Developer Program)
- Windows: EV certificate recommended for auto-update trust (~$300/year)
- Mac App Store and Microsoft Store evaluated after initial stable release

## Consequences

- Auto-updates must never interrupt an active presentation session
- The projector output window is a separate `WebviewWindow`, not a popup
- Projection state is communicated via Tauri IPC, not BroadcastChannel
- Desktop build requires Rust toolchain on CI
