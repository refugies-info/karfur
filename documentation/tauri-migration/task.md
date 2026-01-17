# Tauri Mobile App Migration - Task Checklist

## Milestone 0: Monorepo Migration (Turborepo → Moonrepo)
- [ ] Install Moonrepo CLI and initialize workspace
- [ ] Run `moon ext migrate-turborepo` to convert turbo.json
- [ ] Configure `.moon/toolchain.yml` for Node.js and Rust
- [ ] Configure `.moon/workspace.yml` with extensions and projects
- [ ] Update root package.json scripts to use `moon run`
- [ ] Migrate CI/CD workflows (GitHub Actions)
- [ ] Verify all existing apps build correctly with Moonrepo
- [ ] Remove Turborepo dependencies and configuration
- [ ] Create PR for Moonrepo migration

## Milestone 1: Tauri App Foundation
- [ ] Create new `apps/tauri-mobile` directory structure
- [ ] Initialize Tauri 2.0 project with React + TypeScript
- [ ] Configure Vite for mobile development (TAURI_DEV_HOST)
- [ ] Set up TailwindCSS with shared design tokens from UI package
- [ ] Configure TanStack Router with file-based routing
- [ ] Set up Zustand store structure mirroring Redux slices
- [ ] Configure Tauri plugins (deep-linking, notification)
- [ ] Set up Android project configuration
- [ ] Set up iOS project configuration
- [ ] Create PR for Tauri foundation

## Milestone 2: Shared UI Package Refactoring
- [ ] Audit website components for mobile-compatible extraction
- [ ] Extract theme/design tokens to shared package
- [ ] Create shared button components (primary, secondary, small)
- [ ] Create shared text/typography components
- [ ] Create shared form input components
- [ ] Create shared modal/dialog components
- [ ] Create shared card components
- [ ] Create shared loading/skeleton components
- [ ] Update website to consume refactored shared components
- [ ] Create PR for shared UI components

## Milestone 3: Onboarding Flow
- [ ] Implement LanguageChoiceScreen
- [ ] Implement OnboardingSteps container
- [ ] Implement FilterAge screen
- [ ] Implement FilterCity screen (with geolocation)
- [ ] Implement FilterFrenchLevel screen
- [ ] Implement FinishOnboarding screen
- [ ] Implement ActivateNotificationsScreen
- [ ] Persist onboarding state with Zustand persist
- [ ] Add navigation guards for onboarding completion
- [ ] Create PR for onboarding flow

## Milestone 4: Core Navigation & Layout
- [ ] Implement bottom tab navigator
- [ ] Implement Explorer tab layout
- [ ] Implement Search tab layout
- [ ] Implement Favorites tab layout
- [ ] Implement Profile tab layout
- [ ] Implement header components
- [ ] Implement safe area handling
- [ ] Create PR for core navigation

## Milestone 5: Search Interface
- [ ] Integrate Algolia search client
- [ ] Implement SearchScreen with suggestions
- [ ] Implement SearchResultsScreen
- [ ] Implement search filters (department, theme, need, age, etc.)
- [ ] Implement ContentCard component
- [ ] Create PR for search interface

## Milestone 6: Content Display
- [ ] Implement ContentScreen main view
- [ ] Implement content header with theme badge
- [ ] Implement accordion sections
- [ ] Implement HTML content rendering
- [ ] Implement location display with map
- [ ] Implement share functionality
- [ ] Create PR for content display

## Milestone 7: Favorites & Profile
- [ ] Implement favorites storage (Tauri store plugin)
- [ ] Implement FavoritesScreen listing
- [ ] Implement ProfileScreen
- [ ] Implement language settings
- [ ] Implement accessibility settings (font size, TTS)
- [ ] Implement notification preferences
- [ ] Create PR for favorites and profile

## Milestone 8: Notifications & Deep Linking
- [ ] Configure Tauri notification plugin
- [ ] Implement push notification handling
- [ ] Configure deep linking for refugies.info URLs
- [ ] Implement notification screen
- [ ] Test notification flows on iOS and Android
- [ ] Create PR for notifications

## Milestone 9: Testing & Polish
- [ ] Write unit tests for Zustand stores
- [ ] Write integration tests for key flows
- [ ] Add E2E tests with WebDriver
- [ ] Performance optimization
- [ ] Accessibility audit and fixes
- [ ] Final UI polish
- [ ] Create release PR
