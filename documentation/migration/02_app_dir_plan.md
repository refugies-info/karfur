# Next.js App Directory Migration Plan

## 1. Executive Summary

Migrating to the Next.js App Router (`app` directory) represents a major architectural shift from the current Pages Router. This move unlocks React Server Components (RSC), improved performance, and nested layouts.

**Prerequisites:**
- Finish Redux -> TanStack Query migration (highly recommended to simplify data fetching pattern).
- Ensure `react-dsfr` and `@refugies-info/ui` are compatible with 'use client' directives where needed.

## 2. Key Architectural Shifts

### A. Routing & Layouts
- **Current**: `pages/_app.tsx` + `pages/_document.tsx` + `getLayout` pattern.
- **New**: `app/layout.tsx` (Root Layout) + nested `layout.tsx` files.
- **Action**: Move global providers to a Client Component wrapper (`app/providers.tsx`) and import into Root Layout.

### B. Internationalization (i18n)
- **Current**: Next.js built-in `i18n` config + `next-i18next`.
- **New**: **Not supported** in App Router. We must use **Middleware-based i18n**.
- **Strategy**:
    - Remove `i18n` from `next.config.js`.
    - Create `middleware.ts` to handle locale detection and redirection.
    - Structure routes as `app/[locale]/...`.
    - Replace `next-i18next` with `react-i18next` (client) + `i18next` (server instance) OR `next-intl`.

### C. Styling (Styled-Components)
- **Current**: `_document.tsx` collects styles (ServerStyleSheet).
- **New**: Use a **Styled Components Registry** in Root Layout.
- **Action**: Create `lib/registry.tsx` to handle CSS injection on the server.

### D. Data Fetching
- **Current**: `getStaticProps` / `getServerSideProps` / `getInitialProps`.
- **New**: Async Server Components + TanStack Query (Client hydration).
- **Strategy**:
    - Direct DB/API calls in Server Components where possible.
    - Prefetch QueryClient in Server Components for client hydration (already set up in Redux plan).

## 3. Migration Strategy (Incremental)

We can incrementally migrate by keeping `pages` and allowing `app` to take over specific routes.

### Phase 1: Infrastructure Setup (Week 1)
1. **Configure `next.config.js`**: Enable `appDir` (if on older Next) - *Already enabled in generic Next 15*.
2. **Styled Components Registry**: Create `lib/registry.tsx`.
3. **Root Layout**: Create `app/[locale]/layout.tsx`.
    - Note: We need `[locale]` folder because native i18n routing is gone.
4. **Providers**: Move providers from `_app.tsx` to `app/providers.tsx`.
5. **i18n Middleware**: Create `middleware.ts`.

### Phase 2: Static Pages (Week 2)
Migrate simple pages first:
- `404`, `500` (Error boundaries)
- `mentions-legales`, `politique-de-confidentialite`
- **Goal**: Validate the Layout and i18n middleware work without breaking the main app.

### Phase 3: Auth & Account (Week 3)
- Migrate `auth/*` pages.
- Verify `useAuth`, `useSession`, and protected routes logic (moved to Middleware or Server Component checks).

### Phase 4: Main Features (Week 4-6)
- **Home (`/`)**: High traffic, needs good SEO. Move `getStaticProps` to Server Component.
- **Search (`/recherche`)**: Complex state. Keep as Client Component page initially (`'use client'`), wrapped in Server Layout.
- **Dispositif (`/dispositif/[id]`)**: Heavy data fetching. Ideal candidate for Server Components.

### Phase 5: Cleanup (Week 7)
- Delete `pages` directory.
- Remove `next-i18next` dependencies.
- Remove `_app.tsx` and `_document.tsx`.

## 4. Implementation Details

### Directory Structure
```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx      # Root Layout (html/body)
│   │   ├── page.tsx        # Homepage
│   │   ├── providers.tsx   # Client Providers
│   │   ├── auth/
│   │   │   └── page.tsx
│   │   └── ...
│   └── api/                # Route Handlers (replaces pages/api)
├── middleware.ts           # i18n handling
└── i18n/                   # Translation config
```

### Dependencies to Update
- **Uninstall**: `next-i18next` (eventually)
- **Install**: `negotiator`, `@formatjs/intl-localematcher` (for middleware locale detection)

## 5. Risks
- **SEO Impact**: Changing routing/i18n structure can affect SEO if `hreflang` tags are not correct. *Mitigation: Strict verification of metadata.*
- **Library Compatibility**: Some UI libraries might not support Server Components. *Mitigation: Wrap them in 'use client' components.*
