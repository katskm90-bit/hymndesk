# ADR-008: Projection Architecture

**Status:** Accepted  
**Date:** 2026-09-23  

## Decision

Projection is a platform-agnostic **ProjectionDomain** state machine in `packages/projection`. Platform-specific adapters implement a common interface.

```
ProjectionDomain
  ├── WebProjectionAdapter    → BroadcastChannel (tab-to-tab, web only)
  ├── DesktopProjectionAdapter → Tauri IPC (window-to-window)
  └── RemoteProjectionAdapter  → Local network (future)
```

## Adapter interface

```typescript
interface ProjectionAdapter {
  sendState(state: PresentationSession): void;
  onStateChange(handler: (state: PresentationSession) => void): void;
  connect(): Promise<void>;
  disconnect(): void;
  getConnectionState(): ConnectionState;
}
```

## Source location (current monolith)

`index.html` lines ~3886–4229 contain the current projection implementation. BroadcastChannel is extracted as a web adapter in Phase 2.

## Critical constraint

Projection must work entirely offline. Any state that needs to survive a crash is persisted locally on every state change (crash recovery).

## Remote control boundary (future)

The `RemoteProjectionAdapter` slot is reserved. When implemented, a mobile device on the same LAN connects via a session token (QR/PIN) and issues projection commands through the adapter interface. The ProjectionDomain does not change.
