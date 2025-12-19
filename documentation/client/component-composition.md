# Component Composition Guide

This guide documents how we build composable UI components in the Réfugiés.info codebase. The recommendations draw inspiration from the shadcn/ui and Radix UI ecosystems while remaining aligned with our DSFR-first design language, RGAA 4 accessibility requirements, and monorepo conventions.

---

## 1. Core Principles

> **Important:** Before designing a new component, confirm whether `react-dsfr` already provides the required pattern. Only build bespoke components when DSFR coverage is missing or insufficient.

1. **Composition over configuration**: Prefer assembling small focused primitives rather than exposing sprawling props APIs.
2. **Accessible by default**: Start with semantic HTML/Radix primitives, announce dynamic updates via `useAnnounce`, and validate with screen readers.
3. **Deterministic styling**: Layer Tailwind + DSFR classes so overrides are predictable and token-driven.
4. **Forward refs everywhere**: Wrap root elements in `React.forwardRef` to enable ref access for Radix, DSFR, and integration tests.
5. **Context, not prop drilling**: Share state via `createContext` with typed providers; expose hooks that throw when misused.
6. **Composable state machines**: Use controlled/uncontrolled patterns modelled on Radix (prop + onChange) and expose `useControllableState` helpers when needed.

> **Important:** All reusable UI primitives live in `packages/ui`. Only import them into apps once they are documented and exported from that package.

---

## 2. Component Anatomy

Borrow Radix's slot naming to keep consistent mental models.

```text
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title />
      <Dialog.Description />
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**Guidelines**
- Root component hosts shared state/context.
- Slot components read from context and forward refs.
- Slots accept an `asChild` prop to allow polymorphic composition with DSFR widgets or native tags.
- Provide primitive exports (`DialogBody`, `DialogFooter`) when repeated layouts emerge.

---

## 3. Example: Composable Filter Drawer

```tsx
import { createContext, useContext, useId, useMemo } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";

interface FilterContextValue {
  disclosureId: string;
  setOpen: (value: boolean) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

function useFilterContext(component: string): FilterContextValue {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error(`${component} must be used within <Filter.Root>`);
  }
  return context;
}

export interface FilterRootProps {
  readonly open: boolean;
  readonly onOpenChange: (value: boolean) => void;
}

export const FilterRoot = ({ open, onOpenChange, children }: PropsWithChildren<FilterRootProps>) => {
  const disclosureId = useId();
  const announce = useAnnounce();

  const value = useMemo(
    () => ({
      disclosureId,
      setOpen: (value: boolean) => {
        onOpenChange(value);
        announce(value ? "Filtres ouverts" : "Filtres fermés");
      },
    }),
    [announce, disclosureId, onOpenChange],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const FilterTrigger = forwardRef<HTMLButtonElement, ComponentProps<typeof Button>>(function FilterTrigger(
  props,
  ref,
) {
  const { disclosureId, setOpen } = useFilterContext("Filter.Trigger");
  return (
    <Button ref={ref} aria-controls={disclosureId} aria-expanded={props["aria-expanded"]} onClick={() => setOpen(true)} {...props} />
  );
});

export const FilterContent = forwardRef<HTMLDivElement, ComponentProps<"div">>(function FilterContent(
  { className, ...rest },
  ref,
) {
  const { disclosureId, setOpen } = useFilterContext("Filter.Content");
  return (
    <div
      ref={ref}
      id={disclosureId}
      role="dialog"
      aria-modal="true"
      className={cn("max-h-[min(80vh,600px)] overflow-y-auto rounded-lg bg-white shadow-lg", className)}
      {...rest}
    >
      <button type="button" className="fr-link fr-icon-close-line" onClick={() => setOpen(false)}>
        Fermer
      </button>
      {rest.children}
    </div>
  );
});
```

**Key takeaways**
- Context enforces composition and reduces prop drilling.
- `useAnnounce` centralises verbal feedback.
- Tailwind classes use DSFR-compatible tokens; `cn` helper merges overrides.
- Controlled state ensures ownership remains with parent screens or global stores.

---

## 4. Slots & Polymorphism

- Prefer an `asChild` boolean to pass direct children into Radix `Slot`.
- Accept a limited set of `as` strings (`"div" | "section" | ComponentType`) when DSFR compositions are needed.
- Ensure TypeScript typing preserves props of the chosen element by using polymorphic helper utilities (e.g., `SlotProps<T>`).

```tsx
export interface TooltipTriggerProps extends SlotProps<"button"> {}

export const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(function TooltipTrigger(
  { asChild, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} type="button" {...props} />;
});
```

---

## 5. Managing State & Variants

1. **Controlled-only**: Parent owns state. Provide `value`, `onValueChange` props.
2. **Uncontrolled**: Internal state via `useState`; expose `defaultValue` and `onValueChange` for subscriptions.
3. **Hybrid**: Use `useControllableState` helper to avoid divergence (mirror of Radix implementation).
4. **Variants**: Define variant maps using `cva` or DSFR utility classes. Align names with UX spec: `size`, `tone`, `layout`.

```tsx
const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        info: "bg-mention-bleu-main text-dsfr-text-title-grey",
        success: "bg-mention-verte-main text-white",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
      },
    },
    defaultVariants: {
      tone: "info",
      size: "md",
    },
  },
);
```

---

## 6. Accessibility Checklist

- ✅ Use semantic elements (`<button>`, `<nav>`, `<dialog>`) or ARIA roles only when semantics unavailable.
- ✅ Announce dynamic updates via `useAnnounce` (e.g., filter counts, validation states, async completions).
- ✅ Manage focus: trap inside dialogs, restore on close, expose `initialFocusRef` hooks.
- ✅ Respect RGAA 4: ensure contrast, keyboard navigation, screen-reader parity, and localisation.
- ✅ Provide `aria-live` regions for background operations when `useAnnounce` is insufficient.
- ⚠️ Never disable pointer events without providing keyboard alternative.

---

## 7. Styling Strategy

1. **Tokens first**: Use DSFR Tailwind presets (`bg-artwork-minor-blue-france`, `text-title-blue-france`, `border-default-grey`).
2. **Cascade layers**: Keep component styles in `@layer components` or inline Tailwind classes.
3. **Avoid inline styles** except for CSS custom properties.

---

## 8. Documentation & Storybook

- Every new component MUST include a Storybook story showcasing each variant, state, and composition slot.
- Stories should demonstrate swapping primitives via `asChild`, mobile vs desktop layouts, and common accessibility scenarios (`ScreenReaderAnnouncer`, focus management).
- Provide MDX docs with usage guidance and cross-link to related DSFR patterns.
- Document expected translations in `common.json` and add copy to Figma specs when relevant.

---

## 9. Testing Discipline

1. **Unit tests** for controlled/uncontrolled transitions and context guards.
2. **Integration tests** ensuring keyboard navigation, focus traps, and `useAnnounce` hooks fire.
3. **Visual regression**: Add Chromatic stories for complex compositions.
4. **E2E** (Playwright) when components drive critical flows (e.g., filter panels, multi-select menus).

---

## 10. Migration Guidelines

- Wrap legacy SCSS components with adapter layers before refactoring; incrementally move logic into composable primitives.
- Avoid rewriting working DSFR components; extend via slots or wrappers.
- Maintain backwards compatibility by exporting both `LegacyComponent` and `ComponentV2` with shared props until consumers migrate.

---

## 11. Checklist Before Shipping

- [ ] Uses semantic markup and `React.forwardRef` across all slots.
- [ ] Announces meaningful state changes via `useAnnounce` or live regions.
- [ ] Exposes a controlled API (value + onChange) or justifies uncontrolled usage.
- [ ] Provides Tailwind/DSFR classes without arbitrary values.
- [ ] Includes Storybook stories covering variants, edge cases, and RTL.
- [ ] Contains unit/integration tests for accessibility and state transitions.
- [ ] Adds translation keys to `common.json` for any user-facing string.
- [ ] Documents migration plan if replacing existing components.

---

By following these guidelines, we ensure every component remains accessible, composable, and maintainable while integrating seamlessly with DSFR, shadcn-style composition, and Radix-inspired primitives.
