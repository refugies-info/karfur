# Réfugiés.info Architecture Migration Guide

This directory contains the detailed plans and documentation for modernizing the Réfugiés.info frontend architecture.

## 🎯 Architectural Vision

Our goal is to move from a legacy Redux/Saga + Pages Router architecture to a modern, performant stack using **Server Components (App Router)** and **Server State Management (TanStack Query)**.

To achieve this cleanly, we are executing a **Two-Phase Migration Strategy**:

### 📦 Project A: State Management Modernization
**Goal**: Remove global Redux state to prepare for Server Components.

**Benefits**:
*   📉 **-65% Code Reduction**: Eliminating Redux actions, reducers, and Sagas boilerplate.
*   ⚡ **+20% Faster TTI**: Reducing main thread blocking by removing heavy hydration logic.

- **Why**: Redux is difficult to use in the App Router. We need to separate *Server State* (Data) from *UI State*.
- **Tech Stack**:
    - `next-redux-wrapper` + `redux-saga` ➡️ **REMOVED**
    - Data Fetching ➡️ **TanStack Query** (React Query)
    - UI State ➡️ **Zustand**

📄 **Documentation**:
- [Migration Plan](./01_redux_plan.md): The step-by-step strategy for replacing Redux.
- [Code Examples](./01_redux_examples.md): Recipes for replacing Sagas with Hooks and Stores.

---

### 🚀 Project B: Routing & Rendering Modernization
**Goal**: Adopt Next.js App Router for better performance and DX.

**Benefits**:
*   📉 **-40% Implementation Time**: Simplified layouts and data fetching patterns.
*   ⚡ **+30% Faster LCP**: Streaming HTML and executing less JS on the client (Zero Bundle Size components).

- **Why**: Unlock nested layouts, React Server Components (RSC), and improved streaming.
- **Tech Stack**:
    - `pages/` directory ➡️ `app/` directory
    - `next-i18next` ➡️ **Middleware + react-i18next / next-intl**
    - `_document.tsx` ➡️ **Root Layout + Styled Components Registry**

📄 **Documentation**:
- [Migration Plan](./02_app_dir_plan.md): Roadmap for moving pages and providers.
- [Code Examples](./02_app_dir_examples.md): Recipes for Layouts, Middleware, and Registry.

---

## ⏱️ Estimated Timeline

We estimate the total transformation to take **~3 months manually**, or about **~5 weeks with AI assistance**.

| Project | Human Speed | AI-Assisted Speed | Impact |
| :--- | :--- | :--- | :--- |
| **Project A (State)** | 6 Weeks | **~3 Weeks** | 🤖 AI accelerates hook generation, boilerplace deletion, and test migration. |
| **Project B (Router)** | 6 Weeks | **~2 Weeks** | 🤖 AI accelerates layout scaffolding, middleware config, and "use client" directives. |
| **Total** | **12 Weeks** | **~5 Weeks** | **-58% Time Reduction** |

---

## 📅 Project A Roadmap: State Management

1.  **Foundation**: Install TanStack Query, setup Provider.
2.  **Pilot**: Migrate `Themes` (Data) and `TTS` (UI) to prove the pattern.
3.  **Execute**: Migrate remaining 20+ reducers incrementally.
4.  **Completion**: Remove Redux codebase entirely.

## 📅 Project B Roadmap: App Router

*Prerequisites: Completion of Project A is highly recommended.*

1.  **Foundation**: Create `app/layout.tsx`, `middleware.ts`, and `registry.tsx`.
2.  **Pilot**: Migrate simple static pages (e.g., `mentions-legales`).
3.  **Execute**: Migrate high-traffic pages (`/`, `/recherche`).
4.  **Completion**: Delete `pages/` directory.
