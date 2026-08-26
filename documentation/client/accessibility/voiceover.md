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
- Routes served without a `<title>` get a humanized fallback derived from the route pattern, never a raw URL path.

### Pages with an autofocus

On routes where the page sets its own autofocus (the auth funnel), the paragraph is kept in sync but never focused: the focused field is the announcement. The centralized list lives in `useRouteAnnouncement.ts` (`AUTOFOCUS_ROUTE_PATTERNS`), expressed as `router.pathname` patterns.

To update the list:

1. Add the route pattern with a comment giving the `file:line` that declares the autofocus.
2. State in the comment whether the autofocus behavior was actually measured in a browser (with an authenticated session when the route requires one; without a session most auth sub-routes redirect to `/fr/auth` and any measurement is wrong) or only declared in the code.
3. Never add a route on the sole basis of an `autofocus` attribute in the DOM: two routes were measured with a declared autofocus that poses no focus at all.

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

