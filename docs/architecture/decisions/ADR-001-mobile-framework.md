# ADR-001: Mobile Framework

**Status:** Accepted  
**Date:** 2026-09-23  
**Deciders:** Product owner  

## Context

HymnDesk requires native Android and iOS applications. The current web application is a browser-based PWA. A mobile architecture must be chosen before Phase 3 development begins.

The decision must support: offline SQLite storage, secure credential storage (Keychain/Keystore), audio synthesis (pitch pipe), push notifications, background sync, and EAS-managed build/distribution pipelines.

## Decision

**React Native + Expo** is the mobile framework for HymnDesk Android and iOS applications.

- Expo development builds (not Expo Go) are required for production-grade native modules
- EAS Build handles all cloud builds
- EAS Submit handles App Store and Play Store submission

## Rationale

- The codebase is TypeScript throughout. React Native shares language and tooling with the monorepo
- Supabase has a first-class JavaScript client with full feature parity
- `expo-sqlite` provides the offline SQLite layer
- `expo-secure-store` provides Keychain (iOS) and Keystore (Android) access
- `expo-av`/`expo-audio` provides audio synthesis for the pitch pipe
- EAS Build eliminates the need to maintain native CI infrastructure
- Domain packages (`packages/domain`, `packages/hymn-engine`, etc.) are consumed directly — no Dart rewrite required

## Alternatives Considered

**Flutter:** Superior rendering on very low-end Android hardware. Rejected because: requires complete Dart rewrite of all domain logic; Supabase Flutter client has smaller feature surface than the JS client; separate build pipeline required.

**Capacitor / Ionic / Cordova:** Explicitly prohibited. WebView-based — not native.

**Packaging the PWA:** Explicitly prohibited. Not a native application.

## Consequences

- Mobile UI is native-rendered React Native components — no WebView as primary interface
- Tablet layouts are implemented as responsive branches within the same app (not a separate app)
- Development requires physical devices or simulators with a development build (not Expo Go) for secure-store and background audio
- EAS account required for cloud builds (Apple Developer + Google Play accounts required for store submission)

## Future Decisions

- Remote control (tablet/phone connecting to desktop presentation) uses the `RemoteProjectionAdapter` slot in the ProjectionDomain and does not require a framework change
