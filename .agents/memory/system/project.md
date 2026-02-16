---
description: Réfugiés.info (karfur) - Project overview, purpose, and compliance standards.
---

# Réfugiés.info (karfur)

**Purpose**: A French government digital service (DIAIR) designed to help refugees navigate administrative processes and access integration resources.
**Status**: Active production, multilingual (8 languages).

## Key Facts
- **License**: MIT
- **Governance**: French Ministry of Interior (Ministère de l'Intérieur)
- **Compliance**: RGAA 4 (French accessibility standards), GDPR, DSFR (French government design system)
- **Primary Users**: Refugee populations (mobile-first), social workers, administrators
- **Live Site**: https://refugies.info

## Core Principles (Non-Negotiable)
1. **Accessibility First (RGAA 4)**: Mandatory testing, semantic HTML, keyboard nav, screen reader compatibility. Use `useAnnounce` for dynamic updates.
2. **Multilingual by Design**: Support for 8 languages (fr, ar, fa, ps, ti, so, am, uk). Externalize all user-facing text.
3. **Mobile-First**: Optimized for mobile web browsers, as this is the primary access method for refugees.
4. **Government Standards**: Strict adherence to DSFR components and tokens via `react-dsfr`.
5. **Progressive Migration**: Gradual move from legacy (Redux, SCSS, Pages Router) to modern (Context, Tailwind, App Router).
