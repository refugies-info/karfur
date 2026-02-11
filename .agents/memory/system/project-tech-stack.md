---
description: Technologies, frameworks, and versions used in the project. What to use for new features and what's being phased out.
limit: 20000
---

## Core Technologies

**Runtime & Tools**:
- **Node.js**: 24.11.1 (specified in engines, volta)
- **Package Manager**: pnpm 10.26.1
- **Build Tool**: Turborepo 2.6.0
- **Language**: TypeScript ^5.9.2 (strict mode required)

## Application Frameworks

**Frontend**:
- **Client**: Next.js (App Router preferred for new features)
- **Mobile**: React Native with Expo
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.x + react-dsfr 1.20.2
- **State Management**: 
  - ✅ New: Context API, React hooks
  - ⚠️ Legacy: Redux + Sagas (being phased out)

**Backend**:
- **Server**: Express.js
- **Database**: MongoDB 6.20.0
- **Schema**: 
  - ✅ New: Zod + Mongoose (@zodyac/zod-mongoose)
  - ⚠️ Legacy: TypeGoose (being migrated)

## Development Tools

**Code Quality**:
- **Linting/Formatting**: Biome 2.3.7 (replaced Prettier/ESLint)
- **Pre-commit**: Husky >=9.1.6 + lint-staged 15.5.2
- **Unused Code Detection**: knip ^5.63.0

**Testing**:
- **Framework**: Jest
- **Strategy**: Narrow integration testing (minimal mocks)

## External Services

**Integrations**:
- Airtable (content management)
- Algolia (search)
- Brevo (email marketing, replaced Sendgrid partially)
- Sendgrid (legacy email)
- Twilio (SMS)
- Slack (notifications)
- Cloudinary (image hosting)
- Firebase (mobile analytics)

## Migration Status

**Actively Migrating**:
1. ✅ Biome (done, replaces Prettier/ESLint)
2. 🚧 Zod schemas (in progress, replacing TypeGoose)
3. 🚧 Tailwind CSS (ongoing, replacing SCSS)
4. 🚧 App Router (ongoing, alongside Pages Router)
5. 🚧 Context API (ongoing, replacing Redux)

**For New Features**:
- ✅ Use: App Router, Tailwind, Context API, Zod schemas
- ❌ Avoid: Pages Router, SCSS, Redux/Sagas, TypeGoose