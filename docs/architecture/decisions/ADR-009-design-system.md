# ADR-009: Design System

**Status:** Accepted  
**Date:** 2026-09-23  

## Decision

HymnDesk uses a token-based design system defined in `packages/design-tokens`. Design tokens are the source of truth for colour, typography, and spacing across all platforms.

## Typography

- **Playfair Display** — hymn titles, reading experiences, projection output, brand moments
- **Inter / system-ui** — all operational UI (navigation, lists, labels, buttons, inputs, tables)

## Brand colour

Orange `#E8650A` is used exclusively for: primary action, selection indicator, active state. Not used decoratively.

## Prohibited patterns

Gradient primary/secondary buttons, gradient navigation, gradient cards, emoji as icons, coloured rounded-square icon tiles, glassmorphism, cards inside cards, every section inside a card, generic SaaS/dashboard/AI appearance.

## Principle

Hymn content is the visual hero. The interface supports content rather than competing with it. Premium means: precise, fast, consistent, readable, restrained, well-aligned, well-spaced.
