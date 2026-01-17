# Tauri Mobile App Migration - Implementation Plan

This document provides a comprehensive plan for migrating the Réfugiés.info mobile application from React Native/Expo to Tauri v2 with React, TanStack Router, Zustand, and TailwindCSS. The migration includes a preliminary step to migrate the monorepo from Turborepo to Moonrepo to support polyglot development (TypeScript + Rust).

## Executive Summary

The current mobile app (`apps/mobile`) is built with:
- **React Native 0.79** with Expo SDK 53
- **React Navigation** for routing
- **Redux + Redux-Saga** for state management
- **styled-components** for styling
- **React Query** for data fetching

The new app will be built with:
- **Tauri 2.0** for cross-platform mobile (iOS/Android)
- **React 19** with Vite as the build tool
- **TanStack Router** for type-safe routing
- **Zustand** for lightweight state management
- **TailwindCSS** for styling (matching website)
- **TanStack Query** (React Query v5) for data fetching

> [!IMPORTANT]
> The new Tauri app should adopt the **website mobile breakpoint UI** rather than replicating the current React Native UI. This creates opportunities for significant component sharing between web and mobile via the `@refugies-info/ui` package.

---

## Current Architecture Analysis

### Mobile App Structure (`apps/mobile/src/`)

```
src/
├── components/          # 229 components across 18 categories
│   ├── buttons/         # CustomButton, SmallButton
│   ├── Content/         # Content display components
│   ├── Explorer/        # Explorer tab components
│   ├── formulaire/      # Form inputs
│   ├── iconography/     # Icons
│   ├── Language/        # Language selection
│   ├── layout/          # Page, Header, Footer
│   ├── Notifications/   # Notification components
│   ├── Onboarding/      # Onboarding flow components
│   ├── Profil/          # Profile components
│   ├── Search/          # Search interface
│   ├── typography/      # Text components
│   └── UI/              # Generic UI components
├── navigation/          # React Navigation setup
│   ├── BottomTabNavigator.tsx
│   ├── OnboardingNavigator.tsx
│   └── index.tsx        # RootNavigator
├── screens/             # 85 screens
│   ├── ContentScreen/   # Content detail views
│   ├── ExplorerTab/     # Home/Explorer screens
│   ├── FavorisTab/      # Favorites screens
│   ├── Modals/          # Modal screens
│   ├── Onboarding/      # Onboarding flow screens
│   ├── ProfilTab/       # Profile screens
│   └── SearchTab/       # Search screens
├── services/
│   ├── redux/           # 9 Redux slices
│   │   ├── Contents/
│   │   ├── Languages/
│   │   ├── LoadingStatus/
│   │   ├── Needs/
│   │   ├── SelectedContent/
│   │   ├── Themes/
│   │   ├── User/
│   │   └── VoiceOver/
│   └── i18n/            # Internationalization
├── hooks/               # 13 custom hooks
├── theme/               # styled-components theme
└── utils/               # API, Firebase, utilities
```

### Website Client Structure (`apps/client/src/`)

```
src/
├── components/          # 935 components
│   ├── Pages/
│   │   ├── recherche/   # Search page components
│   │   ├── dispositif/  # Content page components
│   │   └── homepage/    # Homepage components
│   └── UI/              # Reusable UI components
├── pages/               # Next.js pages
│   ├── recherche.tsx    # Search page
│   ├── dispositif/      # Content pages
│   └── index.tsx        # Homepage
└── services/            # Redux stores (similar structure to mobile)
```

### Shared UI Package (`packages/ui/src/`)

```
src/
├── components/
│   ├── composites/      # Complex components (Modal, Map, Breadcrumb)
│   └── primitives/      # Basic components (icons)
├── css/                 # TailwindCSS styles
├── hooks/               # Shared hooks
└── lib/                 # Utilities
```

---

## Milestone 0: Monorepo Migration (Turborepo → Moonrepo)

### Rationale

Moonrepo provides first-class support for polyglot monorepos, treating both Node.js and Rust as first-class citizens. This is essential for Tauri development where Rust code handles native functionality.

### Proposed Changes

#### [NEW] .moon/workspace.yml

Configuration for the Moonrepo workspace:

```yaml
$schema: 'https://moonrepo.dev/schemas/workspace.json'

# Extend from shared configurations
extends: 'https://raw.githubusercontent.com/moonrepo/moon/master/website/static/schemas/workspace.json'

# Project sources and detection
projects:
  apps/*: 'apps'
  packages/*: 'packages'

# VCS settings
vcs:
  manager: 'git'
  defaultBranch: 'dev'
  remoteCandidates:
    - 'origin'

# Extensions for migration
extensions:
  migrate-turborepo:
    plugin: 'https://github.com/moonrepo/moon-extensions/releases/download/migrate_turborepo-v0.1.0/migrate_turborepo.wasm'
```

---

#### [NEW] .moon/toolchain.yml

Toolchain configuration for Node.js and Rust:

```yaml
$schema: 'https://moonrepo.dev/schemas/toolchain.json'

# Node.js configuration (existing projects)
node:
  version: '24.11.1'
  packageManager: 'pnpm'
  pnpm:
    version: '10.26.1'

  # Infer tasks from package.json
  inferTasksFromScripts: true

# Rust configuration (for Tauri)
rust:
  version: 'stable'
  components:
    - 'clippy'
    - 'rustfmt'
  targets:
    - 'aarch64-apple-ios'
    - 'aarch64-apple-ios-sim'
    - 'aarch64-linux-android'
    - 'armv7-linux-androideabi'
    - 'x86_64-linux-android'
```

---

#### [MODIFY] [package.json](file:///Users/luis/Code/refugies_info/karfur/package.json)

Update scripts to use Moonrepo:

```diff
  "scripts": {
-   "build": "turbo build",
+   "build": "moon run :build",
-   "dev": "turbo dev",
+   "dev": "moon run :dev",
-   "test": "turbo test",
+   "test": "moon run :test",
-   "lint": "turbo lint --filter=!@refugies-info/mobile",
+   "lint": "moon run :lint",
    ...
  },
  "devDependencies": {
-   "turbo": "2.6.0",
    ...
  }
```

---

#### [DELETE] turbo.json

Remove Turborepo configuration after migration.

---

### Migration Steps

1. Install Moonrepo: `curl -fsSL https://moonrepo.dev/install/moon.sh | bash`
2. Initialize: `moon init --yes`
3. Run migration: `moon ext migrate-turborepo`
4. Verify builds: `moon run :build`
5. Update CI workflows to use `moon ci`

---

## Milestone 1: Tauri App Foundation

### Directory Structure

```
apps/tauri-mobile/
├── src/                      # React frontend
│   ├── components/
│   ├── routes/               # TanStack Router file-based routes
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── onboarding/
│   │   ├── search/
│   │   ├── content/
│   │   ├── favorites/
│   │   └── profile/
│   ├── stores/               # Zustand stores
│   │   ├── userStore.ts
│   │   ├── contentsStore.ts
│   │   ├── themesStore.ts
│   │   └── needsStore.ts
│   ├── hooks/
│   ├── lib/
│   ├── main.tsx
│   └── App.tsx
├── src-tauri/                # Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   ├── lib.rs
│   │   └── commands/         # Tauri commands
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/
│   └── icons/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── moon.yml                  # Moonrepo project config
```

### Proposed Changes

#### [NEW] apps/tauri-mobile/package.json

```json
{
  "name": "@refugies-info/tauri-mobile",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build",
    "tauri:android:dev": "tauri android dev",
    "tauri:ios:dev": "tauri ios dev",
    "check:types": "tsc --noEmit",
    "lint": "biome lint .",
    "format": "biome format --write ."
  },
  "dependencies": {
    "@refugies-info/api-types": "workspace:*",
    "@refugies-info/ui": "workspace:*",
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-deep-link": "^2.0.0",
    "@tauri-apps/plugin-notification": "^2.0.0",
    "@tauri-apps/plugin-store": "^2.0.0",
    "@tanstack/react-query": "^5.60.0",
    "@tanstack/react-router": "^1.80.0",
    "algoliasearch": "^5.42.0",
    "axios": "^1.12.0",
    "clsx": "^2.1.1",
    "i18next": "^23.16.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-i18next": "^15.7.3",
    "tailwind-merge": "^2.6.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@refugies-info/typescript-config": "workspace:*",
    "@tauri-apps/cli": "^2.0.0",
    "@types/react": "19.0.14",
    "@types/react-dom": "19.2.1",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^4.1.12",
    "typescript": "^5.9.2",
    "vite": "^6.0.0"
  }
}
```

---

#### [NEW] apps/tauri-mobile/src-tauri/tauri.conf.json

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Réfugiés.info",
  "version": "1.0.0",
  "identifier": "info.refugies.app",
  "build": {
    "beforeDevCommand": "pnpm dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "pnpm build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "Réfugiés.info",
        "fullscreen": false,
        "resizable": true
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "iOS": {
      "developmentTeam": "YOUR_TEAM_ID"
    }
  },
  "plugins": {
    "deep-link": {
      "mobile": [
        { "host": "refugies.info", "pathPrefix": ["/"] },
        { "host": "www.refugies.info", "pathPrefix": ["/"] }
      ],
      "desktop": {
        "schemes": ["refugiesinfo"]
      }
    }
  }
}
```

---

#### [NEW] apps/tauri-mobile/vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tailwindcss(),
  ],
  clearScreen: false,
  server: {
    host: host || false,
    port: 1420,
    strictPort: true,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
  },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: 'esnext',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  resolve: {
    alias: {
      '~': '/src',
    },
  },
});
```

---

#### [NEW] apps/tauri-mobile/src/stores/userStore.ts

Zustand store replacing Redux User slice:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Store } from '@tauri-apps/plugin-store';
import type { Languages } from '@refugies-info/api-types';

interface UserState {
  // Persisted state
  hasSeenOnboarding: boolean;
  selectedLanguage: Languages | null;
  city: string | null;
  department: string | null;
  age: string | null;
  frenchLevel: string | null;

  // Actions
  setHasSeenOnboarding: (value: boolean) => void;
  setSelectedLanguage: (language: Languages) => void;
  setCity: (city: string | null) => void;
  setDepartment: (department: string | null) => void;
  setAge: (age: string | null) => void;
  setFrenchLevel: (level: string | null) => void;
  resetOnboarding: () => void;
}

// Custom Tauri storage adapter
const tauriStorage = {
  getItem: async (name: string) => {
    const store = await Store.load('user.json');
    return await store.get(name);
  },
  setItem: async (name: string, value: string) => {
    const store = await Store.load('user.json');
    await store.set(name, value);
    await store.save();
  },
  removeItem: async (name: string) => {
    const store = await Store.load('user.json');
    await store.delete(name);
    await store.save();
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      selectedLanguage: null,
      city: null,
      department: null,
      age: null,
      frenchLevel: null,

      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      setCity: (city) => set({ city }),
      setDepartment: (department) => set({ department }),
      setAge: (age) => set({ age }),
      setFrenchLevel: (level) => set({ frenchLevel: level }),
      resetOnboarding: () => set({
        hasSeenOnboarding: false,
        city: null,
        department: null,
        age: null,
        frenchLevel: null,
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => tauriStorage),
    }
  )
);
```

---

## Milestone 2: Shared UI Package Refactoring

### Component Extraction Strategy

The goal is to extract components from the website (`apps/client`) that can be shared with the Tauri mobile app. These components should:

1. Use TailwindCSS for styling (no SCSS or styled-components)
2. Be responsive and work at mobile breakpoints
3. Not rely on Next.js-specific features

### Components to Extract to `packages/ui`

| Component | Source (Website) | Priority | Notes |
|-----------|------------------|----------|-------|
| Button | `UI/Button` | High | Primary, Secondary, Small variants |
| ContentCard | `Pages/recherche/ContentCard` | High | Search result card |
| ThemeBadge | `Pages/dispositif/ThemeBadge` | High | Theme indicator |
| FilterButton | `Pages/recherche/FilterButton` | High | Filter toggles |
| SearchInput | `Pages/recherche/SearchInput` | High | Search bar |
| Accordion | `UI/Accordion` | Medium | Content sections |
| Toast | `UI/Toast` | Medium | Notifications |
| Skeleton | `UI/Skeleton` | Medium | Loading states |
| LanguageSelector | `User/LanguageSelector` | Medium | Language picker |
| Modal | `composites/Modal` (existing) | Low | Already in UI package |

### Proposed Changes

#### [MODIFY] [packages/ui/src/components/index.ts](file:///Users/luis/Code/refugies_info/karfur/packages/ui/src/components/index.ts)

Add new exports:

```typescript
// Primitives
export * from './primitives';

// Composites
export * from './composites';

// New shared components
export { Button } from './Button';
export { ContentCard } from './ContentCard';
export { ThemeBadge } from './ThemeBadge';
export { FilterButton } from './FilterButton';
export { SearchInput } from './SearchInput';
export { Accordion } from './Accordion';
export { Toast } from './Toast';
export { Skeleton } from './Skeleton';
export { LanguageSelector } from './LanguageSelector';
```

---

#### [NEW] packages/ui/src/components/Button/Button.tsx

```tsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-france-sun-113 text-white hover:bg-blue-france-sun-113-hover',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border-2 border-blue-france-sun-113 text-blue-france-sun-113 hover:bg-blue-50',
  ghost: 'text-blue-france-sun-113 hover:bg-blue-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-france-sun-113 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
```

---

#### [NEW] packages/ui/src/components/ContentCard/ContentCard.tsx

```tsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { SimpleDispositif } from '@refugies-info/api-types';
import { ThemeBadge } from '../ThemeBadge';

interface ContentCardProps {
  content: SimpleDispositif;
  onClick?: () => void;
  className?: string;
}

export function ContentCard({ content, onClick, className }: ContentCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        clsx(
          'w-full text-left rounded-xl border border-gray-200 bg-white p-4',
          'shadow-sm hover:shadow-md transition-shadow',
          'focus:outline-none focus:ring-2 focus:ring-blue-france-sun-113',
          className
        )
      )}
    >
      <div className="flex items-start gap-3">
        {content.theme && (
          <ThemeBadge
            themeId={content.theme}
            size="sm"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {content.titreInformatif}
          </h3>
          {content.titreMarque && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
              {content.titreMarque}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {content.typeContenu === 'dispositif' ? 'Dispositif' : 'Démarche'}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
```

---

## Milestone 3: Onboarding Flow

### Screen Mapping (React Native → Tauri)

| RN Screen | Tauri Route | Components |
|-----------|-------------|------------|
| `LanguageChoiceScreen` | `/onboarding/language` | LanguageDetailsButton |
| `OnboardingSteps` | `/onboarding` | StepIndicator, OnboardingLayout |
| `FilterAge` | `/onboarding/age` | AgeSelector |
| `FilterCity` | `/onboarding/city` | CityAutocomplete |
| `FilterFrenchLevel` | `/onboarding/french-level` | FrenchLevelSelector |
| `FinishOnboarding` | `/onboarding/finish` | - |
| `ActivateNotificationsScreen` | `/onboarding/notifications` | NotificationPrompt |

### Proposed Changes

#### [NEW] apps/tauri-mobile/src/routes/onboarding/language.tsx

```tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { Languages } from '@refugies-info/api-types';
import { useUserStore } from '~/stores/userStore';
import { activatedLanguages } from '~/data/languagesData';
import { LanguageDetailsButton } from '~/components/LanguageDetailsButton';
import helloImage from '~/assets/onboarding/hello.png';

export const Route = createFileRoute('/onboarding/language')({
  component: LanguageChoiceScreen,
});

function LanguageChoiceScreen() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const setSelectedLanguage = useUserStore((s) => s.setSelectedLanguage);

  const handleLanguageSelect = async (language: Languages) => {
    await i18n.changeLanguage(language);
    setSelectedLanguage(language);
    navigate({ to: '/onboarding' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-8 safe-area-inset">
      <div className="flex justify-center my-8">
        <img src={helloImage} alt="" className="w-20 h-20" />
      </div>

      <div className="flex-1 space-y-3">
        {activatedLanguages.map((language) => (
          <LanguageDetailsButton
            key={language.i18nCode}
            langueFr={language.langueFr}
            langueLoc={language.langueLoc}
            langueCode={language.i18nCode}
            onPress={() => handleLanguageSelect(language.i18nCode)}
            showChevron
          />
        ))}
      </div>
    </div>
  );
}
```

---

#### [NEW] apps/tauri-mobile/src/routes/onboarding/index.tsx

```tsx
import { createFileRoute, useNavigate, Outlet } from '@tanstack/react-router';
import { useUserStore } from '~/stores/userStore';
import { StepIndicator } from '~/components/StepIndicator';

const ONBOARDING_STEPS = [
  { path: '/onboarding/age', label: 'Âge' },
  { path: '/onboarding/city', label: 'Ville' },
  { path: '/onboarding/french-level', label: 'Français' },
];

export const Route = createFileRoute('/onboarding')({
  component: OnboardingLayout,
});

function OnboardingLayout() {
  const navigate = useNavigate();
  const currentPath = Route.useMatch().pathname;

  const currentStep = ONBOARDING_STEPS.findIndex(
    (step) => currentPath.startsWith(step.path)
  );

  return (
    <div className="min-h-screen bg-white flex flex-col safe-area-inset">
      <header className="px-4 py-4">
        <StepIndicator
          steps={ONBOARDING_STEPS.length}
          currentStep={currentStep >= 0 ? currentStep : 0}
        />
      </header>

      <main className="flex-1 px-4">
        <Outlet />
      </main>

      <footer className="px-4 py-4">
        <button
          onClick={() => navigate({ to: '/onboarding/finish' })}
          className="text-center text-gray-500 underline w-full"
        >
          Passer cette étape
        </button>
      </footer>
    </div>
  );
}
```

---

## Milestone 4: Core Navigation & Layout

### Navigation Structure

The Tauri app uses TanStack Router with a bottom tab layout similar to the React Native app.

```
/                           # Redirect based on onboarding state
├── /onboarding/...         # Onboarding flow (Milestone 3)
├── /(tabs)/                # Bottom tab layout
│   ├── /explorer           # Home/Explorer tab
│   ├── /search             # Search tab
│   │   └── /search/results # Search results
│   ├── /favorites          # Favorites tab
│   └── /profile            # Profile tab
│       ├── /profile/language
│       ├── /profile/accessibility
│       └── /profile/notifications
├── /content/$contentId     # Content detail (modal or full screen)
└── /notifications          # Notifications list
```

### Proposed Changes

#### [NEW] apps/tauri-mobile/src/routes/__root.tsx

```tsx
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useUserStore } from '~/stores/userStore';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const navigate = useNavigate();
  const hasSeenOnboarding = useUserStore((s) => s.hasSeenOnboarding);
  const selectedLanguage = useUserStore((s) => s.selectedLanguage);

  useEffect(() => {
    // Redirect to onboarding if not completed
    if (!hasSeenOnboarding || !selectedLanguage) {
      navigate({ to: '/onboarding/language' });
    }
  }, [hasSeenOnboarding, selectedLanguage, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}
```

---

#### [NEW] apps/tauri-mobile/src/routes/(tabs).tsx

```tsx
import { createFileRoute, Outlet, Link, useMatches } from '@tanstack/react-router';
import { clsx } from 'clsx';
import {
  HomeIcon,
  SearchIcon,
  HeartIcon,
  UserIcon
} from '~/components/icons';

const TABS = [
  { path: '/explorer', label: 'Explorer', icon: HomeIcon },
  { path: '/search', label: 'Rechercher', icon: SearchIcon },
  { path: '/favorites', label: 'Favoris', icon: HeartIcon },
  { path: '/profile', label: 'Profil', icon: UserIcon },
];

export const Route = createFileRoute('/(tabs)')({
  component: TabLayout,
});

function TabLayout() {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname || '';

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 overflow-auto pb-safe">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex justify-around py-2">
          {TABS.map((tab) => {
            const isActive = currentPath.startsWith(tab.path);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={clsx(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'text-blue-france-sun-113'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
```

---

## Milestone 5: Search Interface

### State Management

The search functionality will use TanStack Query for data fetching and Zustand for UI state (filters, selected results).

### Proposed Changes

#### [NEW] apps/tauri-mobile/src/stores/searchStore.ts

```typescript
import { create } from 'zustand';
import type { Id } from '@refugies-info/api-types';
import type { AgeOptions, FrenchOptions } from '~/data/searchFilters';

interface SearchQuery {
  search: string;
  departments: string[];
  themes: Id[];
  needs: Id[];
  age: AgeOptions[];
  frenchLevel: FrenchOptions[];
}

interface SearchState {
  query: SearchQuery;

  // Actions
  setSearch: (search: string) => void;
  setDepartments: (departments: string[]) => void;
  toggleTheme: (themeId: Id) => void;
  toggleNeed: (needId: Id) => void;
  toggleAge: (age: AgeOptions) => void;
  toggleFrenchLevel: (level: FrenchOptions) => void;
  resetFilters: () => void;
}

const initialQuery: SearchQuery = {
  search: '',
  departments: [],
  themes: [],
  needs: [],
  age: [],
  frenchLevel: [],
};

export const useSearchStore = create<SearchState>((set) => ({
  query: initialQuery,

  setSearch: (search) => set((state) => ({
    query: { ...state.query, search },
  })),

  setDepartments: (departments) => set((state) => ({
    query: { ...state.query, departments },
  })),

  toggleTheme: (themeId) => set((state) => ({
    query: {
      ...state.query,
      themes: state.query.themes.includes(themeId)
        ? state.query.themes.filter((id) => id !== themeId)
        : [...state.query.themes, themeId],
    },
  })),

  toggleNeed: (needId) => set((state) => ({
    query: {
      ...state.query,
      needs: state.query.needs.includes(needId)
        ? state.query.needs.filter((id) => id !== needId)
        : [...state.query.needs, needId],
    },
  })),

  toggleAge: (age) => set((state) => ({
    query: {
      ...state.query,
      age: state.query.age.includes(age)
        ? state.query.age.filter((a) => a !== age)
        : [...state.query.age, age],
    },
  })),

  toggleFrenchLevel: (level) => set((state) => ({
    query: {
      ...state.query,
      frenchLevel: state.query.frenchLevel.includes(level)
        ? state.query.frenchLevel.filter((l) => l !== level)
        : [...state.query.frenchLevel, level],
    },
  })),

  resetFilters: () => set({ query: initialQuery }),
}));
```

---

#### [NEW] apps/tauri-mobile/src/routes/(tabs)/search/index.tsx

```tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { SearchInput, ContentCard } from '@refugies-info/ui';
import { useSearchStore } from '~/stores/searchStore';
import { searchDispositifs } from '~/lib/api';
import { SearchFilters } from '~/components/SearchFilters';

export const Route = createFileRoute('/(tabs)/search/')({
  component: SearchScreen,
});

function SearchScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { query, setSearch } = useSearchStore();

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchDispositifs(query),
    enabled: query.search.length > 0 ||
             query.themes.length > 0 ||
             query.needs.length > 0,
  });

  const handleContentClick = (contentId: string) => {
    navigate({ to: '/content/$contentId', params: { contentId } });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <SearchInput
          value={query.search}
          onChange={setSearch}
          placeholder={t('Search.placeholder', 'Rechercher...')}
        />
        <SearchFilters />
      </header>

      <main className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-xl" />
            ))}
          </div>
        ) : results?.length ? (
          <div className="space-y-4">
            {results.map((content) => (
              <ContentCard
                key={content._id}
                content={content}
                onClick={() => handleContentClick(content._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {query.search || query.themes.length
              ? t('Search.noResults', 'Aucun résultat')
              : t('Search.startSearching', 'Commencez votre recherche')}
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## Milestone 6: Content Display

### Component Mapping

| RN Component | Tauri Component | Notes |
|--------------|-----------------|-------|
| `ContentScreen` | `/content/$contentId` | Full screen route |
| `ContentHeader` | `ContentHeader` | Theme badge, title, sponsor |
| `AccordionSection` | Use `@refugies-info/ui` Accordion | Shared component |
| `ContentBody` | `ContentBody` | HTML rendering with DOMPurify |
| `LocationSection` | `LocationSection` | Map integration |

### Deep Linking Support

The Tauri app will handle deep links to content:
- `https://refugies.info/dispositif/{slug}` → `/content/{id}`
- `https://refugies.info/demarche/{slug}` → `/content/{id}`

---

## Milestone 7: Favorites & Profile

### Storage Strategy

Use Tauri's Store plugin for persistent storage:
- `favorites.json` - List of favorite content IDs
- `user.json` - User preferences (already created in Milestone 1)
- `settings.json` - App settings (font size, accessibility)

---

## Milestone 8: Notifications & Deep Linking

### Tauri Plugins Required

1. **@tauri-apps/plugin-notification** - Native push notifications
2. **@tauri-apps/plugin-deep-link** - URL scheme handling

### Push Notification Strategy

Unlike Expo, Tauri doesn't have a built-in push notification service. Options:
1. Use Firebase Cloud Messaging (FCM) for Android
2. Use Apple Push Notification Service (APNS) for iOS
3. Consider a cross-platform service like OneSignal

> [!WARNING]
> The current mobile app uses Expo Push Notifications. The Tauri app will need a different push notification infrastructure. This should be discussed with the team before implementation.

---

## Verification Plan

### Automated Tests

```bash
# Unit tests for Zustand stores
pnpm --filter @refugies-info/tauri-mobile test

# E2E tests with WebDriver
pnpm --filter @refugies-info/tauri-mobile test:e2e
```

### Manual Verification

1. **Onboarding Flow**
   - Language selection works
   - All filter screens function correctly
   - State persists on app restart

2. **Search**
   - Algolia integration works
   - Filters apply correctly
   - Results display properly

3. **Content Display**
   - Deep links work from external apps
   - HTML content renders correctly
   - Map displays locations

4. **Notifications**
   - Push notifications received
   - Tapping notification opens correct content

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Push notification complexity | High | Consider keeping Expo for notifications initially |
| Component extraction scope creep | Medium | Strict priority-based extraction |
| Moonrepo learning curve | Low | Good documentation, similar concepts to Turbo |
| Tauri mobile maturity | Medium | Tauri 2.0 is stable, but less ecosystem than RN |

---

## Timeline Estimate

| Milestone | Estimated Duration | Dependencies |
|-----------|-------------------|--------------|
| M0: Moonrepo Migration | 1 week | None |
| M1: Tauri Foundation | 1-2 weeks | M0 |
| M2: Shared UI Refactoring | 2 weeks | M1 |
| M3: Onboarding Flow | 1 week | M1, M2 |
| M4: Core Navigation | 1 week | M1 |
| M5: Search Interface | 2 weeks | M2, M4 |
| M6: Content Display | 1-2 weeks | M2, M4 |
| M7: Favorites & Profile | 1 week | M4 |
| M8: Notifications | 2 weeks | M1 |
| M9: Testing & Polish | 2 weeks | All |

**Total: 14-18 weeks**
