# Prompt for Jules (Autonomous Coding Agent): Porting Mobile App to Tauri 2.0

**Role:** You are an expert Mobile & Web Developer specializing in **Tauri 2.0**, **React (Vite)**, and **TypeScript**.
**Task:** Port the existing React Native mobile application (`apps/mobile`) to a new **Tauri 2.0 Mobile Application**.

## 1. Context & Architecture
**Current State:** The existing app (`apps/mobile`) is built with React Native (Expo) and Redux.
**Target State:** A new Tauri 2.0 mobile app running a **Client-Side Web Application** (SPA).
**Target Stack:** **Vite + React + TypeScript**.
**Routing:** **TanStack Router**.
**State Management:**
- **Server State:** `TanStack Query` (React Query).
- **Client/UI State:** **Zustand** (for global config/modals) or `React.useState` (local).
- **Strict Rule:** **NO REDUX**. The new app must **not** use Redux.

**Key Constraints:**
- **Shared UI:** Use the existing `packages/ui` library (React + Tailwind CSS).
- **Shared Logic (Strict):** You **MUST NOT** import code directly from `apps/client`. If you need logic (hooks, utils, constants) that currently lives in `apps/client`, you **MUST extract it** to a new shared package (e.g., `packages/shared` or `packages/core`) first, and then consume it in both apps.

## 2. Overall Plan

### Phase 1: Initialization and Setup
1.  **Create Project:** Initialize a new React project wrapped in Tauri.
    - **Command:** `pnpm create tauri-app@latest`
    - **Selection:** Framework: **React**, Variant: **TypeScript** (this uses Vite).
    - **Location:** `apps/tauri-mobile` (or similar).
    - **Workspace:** Ensure it is part of the monorepo workspace (`pnpm-workspace.yaml`).
2.  **Dependencies:**
    - Install shared packages: `@refugies-info/ui`, `@refugies-info/api-types`.
    - Install core libraries: `@tanstack/react-router` (routing), `@tanstack/react-query` (data), `zustand` (state), `i18next`.

### Phase 2: Logic Extraction (Refactoring)
Before building complex features, identify reusable logic in `apps/client`:
1.  **Audit:** Look for API hooks, authentication logic, and language utilities in `apps/client`.
2.  **Extract:** Move this code to a new workspace package (e.g., `packages/shared`).
3.  **Refactor:** Update `apps/client` to use the new package to ensure no regression.
4.  **Consumable:** Now `apps/tauri-mobile` can cleanly depend on `packages/shared`.

### Phase 3: Shell & Navigation (TanStack Router)
1.  **Router Setup:**
    - Initialize `TanStack Router` with a file-based route tree (or code-based if preferred/easier for this scale).
2.  **Layout (`__root.tsx` or MainLayout):**
    - Create the "App Shell" that conditionally renders the **Bottom Navigation Bar**.
    - The Bottom Bar should use standard `<Link>` components to navigate between:
        - `/explorer` (Map context)
        - `/recherche` (Search)
        - `/favoris` (Saved)
        - `/profil` (User scope)
3.  **Drill-down Routes:**
    - `/content/$contentId` (Detail view).
    - Ensure appropriate transition animations (imitating mobile "push" navigation).

### Phase 4: Feature Implementation
Map the existing React Native screens to efficient Web Components:

1.  **Maps (Explorer Tab):**
    - *Old:* `react-native-maps`
    - *New:* **Leaflet** / `react-leaflet`.
    - *Action:* Reuse the map components already present in `packages/ui`.
2.  **Data & Content:**
    - Migrate data fetching to **TanStack Query**.
    - Ensure "Content Details" can render standard HTML (as the existing app content likely comes as HTML).
3.  **Authentication:**
    - Re-implementauth flows using the extracted shared logic and `packages/ui` components.
    - Persist sessions using `tauri-plugin-store` or secure tokens.

### Phase 5: Native Capabilities (Tauri Plugins)
Replace Expo modules with Tauri 2.0 Plugins:
- **Geolocation:** `tauri-plugin-geolocation` (vs `expo-location`).
- **Notifications:** `tauri-plugin-notification`.
- **Deep Linking:** `tauri-plugin-deep-link`.
- **Storage:** `tauri-plugin-store` (vs `AsyncStorage`).

## 3. Important Guidelines & "Gotchas"

### 1. State Management (Zustand & Query)
- Use **Context/Zustand** only for truly global client data (e.g., "User is logged in", "Current Theme", "Language").
- Use **TanStack Query** for everything API-related.
- **Do not introduce Redux boilerplate.**

### 2. Mobile-First Web Design
- **Touch Targets:** Ensure all buttons are at least 44x44px.
- **Safe Areas:** Handle "Notch" and "Home Bar" areas. You may need to inject CSS variables for `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- **Gestures:** Web apps don't have native swipe-to-go-back by default on all platforms. Consider using a gesture library if the native Tauri webview handling isn't sufficient for your UX standards.

### 3. Navigation UX
- **Hardware Back Button (Android):** You MUST handle this. Listen to the Tauri event and trigger `router.history.back()`.
- **Transitions:** Users expect screens to slide in. TanStack Router allows customization; try to implement simple CSS transitions for route changes.

## 4. First Step for You (Jules)
1.  **Scaffold:** Run `pnpm create tauri-app@latest` -> React -> TypeScript.
2.  **Refactor (Pre-req):** Create the new `packages/shared` package. identifying one small piece of logic (e.g., a simple API helper) from `apps/client`, moving it there, and ensuring the monorepo links correctly.
3.  **Verify:** Prove the new Tauri app can consume both `@refugies-info/ui` (Button) and `packages/shared` (Helper) in a basic "Hello World" screen.
