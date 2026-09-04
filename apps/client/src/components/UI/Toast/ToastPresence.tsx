"use client";

import { ToastViewport } from "@radix-ui/react-toast";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Radix renders an empty `<div role="region" aria-label="Notifications (F8)">` at all times.
 * Screen readers announce it as a landmark leading nowhere (RGAA 8.9, Ideance audit).
 * Radix exposes no toast count, so we track open toasts and mount the viewport only when needed.
 */

/** Leaves room for the `hide 100ms` exit animation in `Toast.module.scss`. */
const EXIT_ANIMATION_MS = 300;

/** An empty object, not `useId`: that would shift the ids DSFR generates downstream. */
type ToastKey = Record<string, never>;

type ToastPresence = {
  hasToasts: boolean;
  setToastOpen: (key: ToastKey, open: boolean) => void;
};

/** Neutral fallback: the test harness mounts its own viewport without going through `_app`. */
const FALLBACK: ToastPresence = { hasToasts: false, setToastOpen: () => {} };

const ToastPresenceContext = createContext<ToastPresence>(FALLBACK);

export const ToastPresenceProvider = ({ children }: { children: ReactNode }) => {
  const [openToasts, setOpenToasts] = useState<ReadonlySet<ToastKey>>(() => new Set());

  const setToastOpen = useCallback((key: ToastKey, open: boolean) => {
    setOpenToasts((prev) => {
      if (open === prev.has(key)) return prev;
      const next = new Set(prev);
      if (open) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ hasToasts: openToasts.size > 0, setToastOpen }),
    [openToasts, setToastOpen],
  );

  return <ToastPresenceContext.Provider value={value}>{children}</ToastPresenceContext.Provider>;
};

export const useDeclareToast = (open: boolean) => {
  const { setToastOpen } = useContext(ToastPresenceContext);
  const [key] = useState<ToastKey>(() => ({}));

  useEffect(() => {
    if (open) {
      setToastOpen(key, true);
      return;
    }
    const timer = setTimeout(() => setToastOpen(key, false), EXIT_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [key, open, setToastOpen]);

  // Separate effect: unmount drops the key at once, and its cleanup must not run on `open` changes.
  useEffect(() => () => setToastOpen(key, false), [key, setToastOpen]);
};

/**
 * Stays mounted while it holds focus: Radix calls `viewport.focus()` when a toast is closed with
 * the keyboard, and unmounting behind it would drop focus on `<body>`.
 */
export const ToastViewportWhenNeeded = (props: ComponentProps<typeof ToastViewport>) => {
  const { hasToasts } = useContext(ToastPresenceContext);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (hasToasts) {
      setMounted(true);
      return;
    }
    const region = ref.current?.parentElement ?? ref.current;
    if (!region?.contains(document.activeElement)) {
      setMounted(false);
      return;
    }
    const handleFocusOut = (event: FocusEvent) => {
      if (!region.contains(event.relatedTarget as Node | null)) setMounted(false);
    };
    region.addEventListener("focusout", handleFocusOut);
    return () => region.removeEventListener("focusout", handleFocusOut);
  }, [hasToasts]);

  if (!mounted) return null;
  return <ToastViewport ref={ref} {...props} />;
};
