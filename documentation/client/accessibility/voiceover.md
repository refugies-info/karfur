# VoiceOver / Screen Reader Announce

This document explains how to announce messages to screen readers (VoiceOver, NVDA, JAWS) in the web client using the announcer utility located at:

- `apps/client/src/components/Accessibility/ScreenReaderAnnouncer.tsx`

It provides a context provider and a simple hook to enqueue announcements for assistive technologies. This is useful to inform users about dynamic changes, navigation, validation errors, background task completion, etc.

## How it works

- The provider renders a live region: `aria-live="assertive"`, `aria-atomic="true"`, `role="status"`.
- Calls to `announce(message, options)` push messages into a queue.
- Each message can be delayed and will be visible to screen readers for ~1500ms before the next message is processed.
- Priority `interrupt` clears the queue immediately to announce urgent messages.
- A debug mode can display the currently announced text visually for easier development.

Underlying implementation: see `ScreenReaderAnnouncerProvider` and `useAnnounce()` in `ScreenReaderAnnouncer.tsx`.

## Installation / Setup

This feature is already configured in the client app. `ScreenReaderAnnouncerProvider` is mounted in `apps/client/src/pages/_app.tsx` and wraps the application tree.

No additional setup is required.

## Usage in components

Use the `useAnnounce()` hook to get the `announce` function and call it when relevant events occur:

```tsx
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";

export function SaveButton() {
  const announce = useAnnounce();

  const onSave = async () => {
    // Background action...
    await doSave();
    announce("Enregistrement terminé", { priority: "normal" });
  };

  return <button onClick={onSave}>Sauvegarder</button>;
}
```

### Options

```ts
announce(message: string, options?: {
  priority?: "interrupt" | "normal"; // default: normal
  delay?: number;                      // default: 0 (ms)
})
```

- `priority: "interrupt"` clears the queue and announces immediately. Use it for critical alerts and validation errors.
- `delay` postpones the announcement, useful when the DOM needs a beat to settle or to coalesce multiple updates.

### Examples

- On lazy content ready: `announce(t("content.ready"), { delay: 300 })`
- On form error focus: `announce(t("form.error"), { priority: "interrupt" })`

Do not use `announce()` for page navigation: route changes have their own mechanism, see "Route change announcements" below.

## Route change announcements (RGAA 12.8)

Page navigation is NOT announced through `useAnnounce`. It uses a separate mechanism, prescribed by the Ideance accessibility audit:

- `_document.tsx` renders a `<p id="route-announcer" tabindex="-1" class="sr-only">` as the first child of `<body>`, before the skip links. On the server it is filled with the page `<title>` extracted from `props.head`.
- `useRouteAnnouncement` (mounted in `_app.tsx`) listens to `routeChangeComplete`. On every client navigation it waits for the new `<title>`, copies it into the paragraph and moves keyboard focus onto it with `focus({ preventScroll: true })`. Receiving focus is what makes screen readers read the title: the paragraph is not a live region.
- The native `<next-route-announcer>` is disabled with `display: none` in `_dsfr-fix.scss`. Keeping both would produce a double vocalisation (measured with VoiceOver on 26/08/2026). Consequence: this paragraph is the only channel that announces the page title. A `document.title` change outside the routing cycle is not announced by anything.

### Why not `useAnnounce`

`useAnnounce` renders an `aria-live` region. The audit prescribes a focusable paragraph, which is a different restitution channel: the announcement comes from the focus move, and the focus repositioning is itself half of the 12.8 requirement. Cumulating both channels (focus plus live region) was measured on 26/08/2026 and brings nothing over the focused paragraph alone, while reintroducing a double vocalisation risk. `useAnnounce` remains the single channel for dynamic component updates (results counts, form errors, background tasks).

### Guards built into the hook

- Shallow navigations are ignored (the search page pushes a debounced shallow navigation on every keystroke; stealing focus from the search field would be a severe regression).
- A navigation where only the locale changes on the same route is ignored (first-load language redirect, language modal validation).
- A navigation triggered by an inter-page anchor (`useScrollToAnchor`) is ignored: the anchor target keeps the focus. The two hooks share a flag, set before the anchor `push` and cleared in a `finally`.
- When one navigation supersedes another, a generation token cancels the pending title wait: only the last navigation writes and focuses.
- Routes served without a `<title>` get a humanized fallback derived from the route pattern, never a raw URL path. See "Routes without a page title" below.

### Title wait budget

The `<title>` is set by `next/head` in the same render cycle as `routeChangeComplete`, but it can be momentarily empty during a transition (measured on the auth funnel redirections). The hook therefore waits for it across animation frames rather than on a timer: a frame budget follows the render cycle on any refresh rate, a millisecond timer does not.

`TITLE_WAIT_MAX_FRAMES` is 30. At 60 Hz that is roughly 500 ms, at 120 Hz roughly 250 ms. Both are well above the 128 ms measured before a redirection supersedes the pending navigation and invalidates the wait. Once the budget is spent the hook writes the humanized fallback instead of leaving the paragraph empty.

### Routes without a page title

The application produces a `<title>` from two places only: `components/Seo.tsx` and `pages/sitemap.tsx`. `<SEO>` always emits a title; without a `title` prop it emits the bare site name `Réfugiés.info`. Two different defects follow:

- A route that never mounts `<SEO>` leaves `document.title` empty. The fallback fires and the paragraph gets a humanized route pattern. Concerned: `/download-app`, `/embed`, `/dispositif/test-preview`, `/_error`.
- A route that mounts `<SEO>` with an empty title announces `Réfugiés.info` on every navigation. The fallback never fires. Concerned: `/dispositif` and `/demarche` in creation mode, both through `components/Content/Dispositif/Dispositif.tsx`.

The fallback lives in `~/lib/humanizeRoutePattern`. It is a safety net, not a substitute for real titles: without it the focus would land on an empty paragraph and nothing at all would be announced, which is a plain 12.8 regression. Giving these routes a real title is a separate task for the refugies.info team; the fallback simply becomes unreachable once they have one.

### Pages with an autofocus

On routes where the page sets its own autofocus (the auth funnel), the paragraph is kept in sync but never focused: the focused field is the announcement. The centralized list lives in `useRouteAnnouncement.ts` (`AUTOFOCUS_ROUTE_PATTERNS`), expressed as `router.pathname` patterns.

To update the list:

1. Add the route pattern with a comment giving the `file:line` that declares the autofocus.
2. State in the comment whether the autofocus behavior was actually measured in a browser (with an authenticated session when the route requires one; without a session most auth sub-routes redirect to `/fr/auth` and any measurement is wrong) or only declared in the code.
3. Never add a route on the sole basis of an `autofocus` attribute in the DOM: two routes were measured with a declared autofocus that poses no focus at all.

### Skip links and anchor landing (RGAA 12.7)

`useScrollToAnchor` focuses the anchor target **before** measuring where to scroll, then measures on the next animation frame. The order is not cosmetic.

The DSFR skip link bar switches from `position: absolute` to `position: relative` while it holds the focus (`.fr-skiplinks:focus-within`, `dsfr.css`) and pushes the page down by its own height. Measuring in that state and then moving the focus out of the bar makes it collapse mid-animation: the scroll lands 48 px too low and the top of the target ends up above the viewport. Measured on `/`, `/agir` and a content page. Focusing first, then measuring one frame later, measures a page that has already settled.

An anchor that targets the current page (`href="#contenu"`) yields an empty `path` once split on `#`. Treating it as a navigation calls `router.push("")`, which Next resolves to the route pattern: a 404 on dynamic routes and a lost query string elsewhere.

## Debugging announcements (visual overlay)

Enable a visual overlay to see what is being announced. Set the following environment variable (already present in the example env file):

```env
NEXT_PUBLIC_SR_DEBUG=true
```

- When `true`, a fixed red bar is displayed at the bottom of the screen showing the current announcement.
- In production or when you don’t need it, set it to `false` or remove it.

See `apps/client/example-env-file.env` line containing `NEXT_PUBLIC_SR_DEBUG=true`.

## Best practices

- Keep messages short and meaningful; they should make sense without visual context.
- Avoid flooding: batch or coalesce multiple non-critical updates.
- Use `priority: "interrupt"` for alerts and validation errors; prefer `normal` for informational updates.
- Announce after the DOM change is complete when the message references newly rendered content (use `delay` when needed).
- Localize messages using our i18n utilities: `announce(t("key"))`.

## Troubleshooting

- Nothing is announced
  - Ensure your component is under `ScreenReaderAnnouncerProvider`.
  - Make sure the code runs on the client (the provider is a client component).
- Visual overlay doesn’t appear
  - Check `NEXT_PUBLIC_SR_DEBUG` is set to `true` and the page reloaded.
- Messages cut off or overlapped
  - Use `priority: "interrupt"` for urgent messages, otherwise let the queue process.
  - Avoid dispatching many messages simultaneously; consider batching with small `delay` values.

