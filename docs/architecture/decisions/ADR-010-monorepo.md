# ADR-010: Monorepo Tooling

**Status:** Accepted  
**Date:** 2026-09-23  

## Decision

**pnpm workspaces + Turborepo** as the monorepo toolchain.

- `pnpm-workspace.yaml` defines `apps/*` and `packages/*` as workspace members
- `turbo.json` defines task pipelines: build, test, lint, typecheck with dependency ordering
- TypeScript project references for incremental compilation
- Shared ESLint and Prettier configurations in root

## Rationale

pnpm's strict dependency isolation prevents phantom dependencies. Turborepo's task caching reduces CI time as the codebase grows. The combination is simpler to configure than Nx while sufficient for this project structure.

## Consequence

Internal packages use `workspace:*` protocol for cross-package dependencies. This means all packages are always at the local version — no version mismatch between monorepo members.
