# Modal Component

An accessible, reusable modal component built on Radix UI Dialog with automatic focus management and WCAG 2.1 compliance.

## Features

- ✅ **WCAG 2.1 AA Compliant** - Meets all accessibility standards
- ✅ **Automatic Focus Management** - Focus trap and return focus to trigger
- ✅ **Keyboard Navigation** - ESC to close, Tab for navigation
- ✅ **Screen Reader Friendly** - Proper ARIA attributes and announcements
- ✅ **Customizable** - Multiple sizes, custom styling, flexible content
- ✅ **DSFR Compatible** - Uses French government design system components

## Installation

The Modal component is part of the `@refugies-info/ui` package:

```bash
pnpm install @refugies-info/ui @radix-ui/react-dialog
```

## Basic Usage

```tsx
import { Modal } from "@refugies-info/ui";
import { useState, useRef } from "react";

function MyComponent() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button ref={triggerRef} onClick={() => setOpen(true)}>
        Open Modal
      </button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        triggerRef={triggerRef}
        title="My Modal Title"
      >
        <p>Modal content goes here</p>
        <button onClick={() => setOpen(false)}>Close</button>
      </Modal>
    </>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | ✅ | - | Controls whether the modal is open |
| `onOpenChange` | `(open: boolean) => void` | ✅ | - | Callback when open state changes |
| `title` | `string` | ✅ | - | Modal title (required for accessibility) |
| `children` | `ReactNode` | ✅ | - | Modal content |
| `description` | `string` | ❌ | - | Optional description for screen readers |
| `triggerRef` | `RefObject<HTMLElement>` | ❌ | - | Ref to trigger element (focus returns here) |
| `closeLabel` | `string` | ❌ | `"Fermer"` | Label for close button |
| `hideCloseButton` | `boolean` | ❌ | `false` | Hide the default close button |
| `maxWidth` | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "full"` | ❌ | `"2xl"` | Maximum width of modal |
| `className` | `string` | ❌ | `""` | Additional CSS classes for content |
| `overlayClassName` | `string` | ❌ | `""` | Additional CSS classes for overlay |
| `onOpenAutoFocus` | `(event: Event) => void` | ❌ | - | Callback when modal opens and focus is set |
| `onCloseAutoFocus` | `(event: Event) => void` | ❌ | - | Callback when modal closes and focus returns |

## Examples

### With Description (for Screen Readers)

```tsx
<Modal
  open={open}
  onOpenChange={setOpen}
  triggerRef={triggerRef}
  title="Confirm Action"
  description="This action cannot be undone. Are you sure?"
>
  <div className="space-y-4">
    <p>Please confirm you want to proceed.</p>
    <button onClick={handleConfirm}>Confirm</button>
  </div>
</Modal>
```

### Different Sizes

```tsx
// Small modal
<Modal maxWidth="sm" {...props}>
  <p>Small content</p>
</Modal>

// Large modal
<Modal maxWidth="4xl" {...props}>
  <div className="grid grid-cols-3 gap-4">
    {/* Wide content */}
  </div>
</Modal>
```

### Without Close Button

```tsx
<Modal hideCloseButton {...props}>
  <p>Must close programmatically or with ESC</p>
  <button onClick={() => setOpen(false)}>Close</button>
</Modal>
```

### With Form

```tsx
<Modal
  open={open}
  onOpenChange={setOpen}
  triggerRef={triggerRef}
  title="Contact Form"
>
  <form onSubmit={handleSubmit}>
    <input type="text" name="name" required />
    <input type="email" name="email" required />
    <button type="submit">Submit</button>
  </form>
</Modal>
```

## Accessibility

### Focus Management

1. **On Open**: Focus moves to the first focusable element inside the modal (or custom via `onOpenAutoFocus`)
2. **Focus Trap**: Tab navigation stays within the modal
3. **On Close**: Focus returns to the trigger element (if `triggerRef` provided)

### Keyboard Navigation

- **ESC**: Closes the modal
- **Tab**: Cycles through focusable elements
- **Shift + Tab**: Cycles backwards

### Screen Readers

- Modal title is announced when opened
- Optional description provides additional context
- Close button has proper ARIA labels
- Overlay is marked as `aria-hidden`

## Best Practices

### ✅ DO

- Always provide a `title` (required for accessibility)
- Pass `triggerRef` to return focus to the trigger element
- Use `description` for important context
- Keep modal content focused and concise
- Test with keyboard navigation
- Test with screen readers (NVDA, JAWS, VoiceOver)

### ❌ DON'T

- Don't nest modals inside modals
- Don't use for non-critical content (use tooltips/popovers instead)
- Don't forget to handle form submissions properly
- Don't override focus management without good reason
- Don't make modals too large (consider a separate page instead)

## Integration with Other Components

### With useAnnounce (Screen Reader Announcements)

```tsx
import { Modal } from "@refugies-info/ui";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";

function MyComponent() {
  const announce = useAnnounce();
  
  const handleSuccess = () => {
    announce("Action completed successfully", { priority: "interrupt" });
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Modal {...props}>
      <button onClick={handleSuccess}>Submit</button>
    </Modal>
  );
}
```

### With DSFR Components

```tsx
import { Modal } from "@refugies-info/ui";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";

function MyComponent() {
  return (
    <Modal {...props}>
      <Input label="Name" />
      <Button onClick={handleSubmit}>Submit</Button>
    </Modal>
  );
}
```

## Troubleshooting

### Focus not returning to trigger

Make sure you're passing the `triggerRef`:

```tsx
const triggerRef = useRef<HTMLButtonElement>(null);

<button ref={triggerRef} onClick={() => setOpen(true)}>
  Open
</button>

<Modal triggerRef={triggerRef} {...props}>
  ...
</Modal>
```

### Modal not closing on ESC

The `onOpenChange` callback must update the `open` state:

```tsx
<Modal
  open={open}
  onOpenChange={setOpen}  // ← Must update state
  {...props}
>
```

### Content overflowing

Use appropriate `maxWidth` or add scrolling:

```tsx
<Modal maxWidth="4xl" className="max-h-[85vh] overflow-y-auto" {...props}>
  {/* Long content */}
</Modal>
```

## Related Components

- `BaseModal` (legacy, being phased out)
- `Dialog` from Radix UI (underlying primitive)
- `ScreenReaderAnnouncer` (for announcements)

## Migration from BaseModal

See the migration guide in the main documentation for converting existing `BaseModal` usage to the new `Modal` component.
