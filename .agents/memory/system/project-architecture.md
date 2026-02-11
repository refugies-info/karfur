---
description: Monorepo structure and architectural patterns. Directory organization, key modules, and how different parts of the system interact.
limit: 20000
---

## Monorepo Structure

**Root**: Turborepo + pnpm workspace
```
karfur/
├── apps/
│   ├── client/              # Next.js (public-facing, Pages & App Router)
│   ├── server/              # Express.js backend (REST API)
│   ├── mobile/              # React Native (Expo)
│   └── storybook/           # Component documentation
├── packages/
│   ├── api-types/           # Shared TypeScript types
│   ├── ui/                  # Shared React components
│   ├── mongo/               # MongoDB schemas (Zod-based, migrating from TypeGoose)
│   └── typescript-config/   # Shared TS configs
├── documentation/           # Project docs
├── migrations/              # Database migrations
└── scripts/                 # Utility scripts
```

## Client Architecture (Next.js)

**Pattern**: Hybrid Pages Router (legacy) + App Router (new features)

```
apps/client/src/
├── pages/                   # Next.js pages (Pages Router)
├── components/              # React components by category
│   ├── Accessibility/       # A11y-focused components
│   ├── Backend/             # Admin/BO components
│   ├── Content/             # Content display
│   ├── Layout/              # Layout components
│   ├── Navigation/          # Nav components
│   ├── Pages/               # Page-level components
│   ├── UI/                  # Generic UI elements
│   └── User/                # User-related
├── services/                # Redux state management (legacy, being phased out)
├── hooks/                   # React hooks
├── lib/                     # Utility libraries
│   ├── dispositif/          # Content (dispositif) logic
│   ├── markdown/            # Markdown rendering
│   └── recherche/           # Search logic
├── assets/                  # Static assets
└── scss/                    # SCSS styles (legacy, migrating to Tailwind)
```

## Server Architecture (Express)

**Pattern**: Module-based with workflows and controllers

```
apps/server/src/
├── modules/                 # Business logic modules
│   ├── dispositif/          # Core content module
│   ├── users/               # User management
│   ├── structure/           # Organizations
│   ├── traductions/         # Translations
│   ├── search/              # Search functionality
│   └── [others]/            # needs, themes, langues, etc.
├── workflows/               # Business process orchestration
├── controllers/             # HTTP endpoint handlers
├── connectors/              # External service integrations
│   ├── airtable/
│   ├── algolia/
│   ├── brevo/
│   ├── sendgrid/
│   ├── slack/
│   └── twilio/
├── typegoose/               # Legacy TypeGoose models (being migrated)
└── locales/                 # i18n translations (8 languages)
```

## Key Architectural Decisions

1. **Progressive Migration Strategy**:
   - Redux → Context API (for new features)
   - Pages Router → App Router (Next.js)
   - SCSS → Tailwind CSS
   - TypeGoose → Zod + Mongoose schemas
   - Prettier/ESLint → Biome

2. **DSFR Integration**:
   - Uses react-dsfr (French government design system)
   - Custom CSS layer patch for Tailwind compatibility
   - All UI should extend DSFR, not replace it

3. **Multilingual by Design**:
   - 8 languages: fr, ar, fa, ps, ti, so, am, uk
   - Content externalized for translation
   - RTL support for Arabic, Dari, Pashto