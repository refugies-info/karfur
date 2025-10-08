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

- After navigation: `announce(t("page.loaded"), { priority: "interrupt" })`
- On lazy content ready: `announce(t("content.ready"), { delay: 300 })`
- On form error focus: `announce(t("form.error"), { priority: "interrupt" })`

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

