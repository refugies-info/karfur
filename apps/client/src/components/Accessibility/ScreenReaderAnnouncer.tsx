/**
 * @fileoverview Screen Reader Announcer - Accessible announcement system for assistive technologies
 *
 * This module provides a centralized system for announcing dynamic content changes to screen readers
 * using ARIA live regions. It ensures announcements are queued, timed appropriately, and don't
 * overwhelm users of assistive technologies.
 *
 * **Key Features:**
 * - ✅ WCAG 2.1 compliant (Success Criterion 4.1.3 - Status Messages)
 * - ✅ Queued announcements to prevent overlap
 * - ✅ Priority system for critical messages
 * - ✅ Delayed announcements for timing control
 * - ✅ Automatic duplicate message handling
 * - ✅ Debug mode for development
 *
 * **Usage:**
 * 1. Wrap your app with `ScreenReaderAnnouncerProvider`
 * 2. Use `useAnnounce()` hook in any component
 * 3. Call `announce(message, options)` to make announcements
 *
 * **When to use:**
 * - Form submission feedback
 * - Loading state changes
 * - Error messages
 * - Success confirmations
 * - Dynamic content updates
 * - Modal open/close events
 * - Search results updates
 *
 * **When NOT to use:**
 * - Static content (use semantic HTML instead)
 * - Content already announced by native elements
 * - Decorative or redundant messages
 *
 * @module ScreenReaderAnnouncer
 * @see {@link https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html WCAG 4.1.3}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions MDN ARIA Live Regions}
 */
"use client";
import { cn } from "@refugies-info/ui";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Options for configuring screen reader announcements.
 *
 * @property {("interrupt" | "normal")} [priority="normal"] - Controls how the announcement is handled:
 *   - `"interrupt"`: Clears the queue and announces immediately (use for critical updates)
 *   - `"normal"`: Adds to the queue and announces in order (default behavior)
 *
 * @property {number} [delay=0] - Delay in milliseconds before the announcement is made.
 *   Useful for waiting for UI updates to complete before announcing.
 *
 * @example
 * ```tsx
 * // Normal announcement (queued)
 * announce("Item added to cart");
 *
 * // Interrupt with critical message
 * announce("Error: Payment failed", { priority: "interrupt" });
 *
 * // Delayed announcement (wait for animation)
 * announce("Loading complete", { delay: 300 });
 * ```
 */
type AnnounceOptions = {
  priority?: "interrupt" | "normal";
  delay?: number;
};

/**
 * Internal queue item structure.
 * @internal
 */
type QueueItem = {
  id: number;
  message: string;
  delay: number;
};

/**
 * Context type for the screen reader announcer.
 * @internal
 */
type AnnouncerContextType = {
  announce: (message: string, options?: AnnounceOptions) => void;
};

const AnnouncerContext = createContext<AnnouncerContextType | null>(null);

/**
 * Hook to announce messages to screen readers using ARIA live regions.
 *
 * This hook provides a centralized way to make announcements that are accessible
 * to assistive technologies. All announcements are queued and announced sequentially
 * to avoid overwhelming screen reader users.
 *
 * @returns {Function} announce - Function to announce messages to screen readers
 *
 * @throws {Error} If used outside of ScreenReaderAnnouncerProvider
 *
 * @example
 * ```tsx
 * import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
 *
 * function MyComponent() {
 *   const announce = useAnnounce();
 *
 *   const handleSave = async () => {
 *     await saveData();
 *     announce("Changes saved successfully");
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Form validation feedback
 * const handleSubmit = (e) => {
 *   e.preventDefault();
 *   if (!isValid) {
 *     announce("Please fix the errors in the form", { priority: "interrupt" });
 *   }
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Modal close with focus management
 * const handleModalClose = () => {
 *   closeModal();
 *   triggerButtonRef.current?.focus();
 *   announce("Modal closed", { delay: 100 });
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Loading states
 * const loadData = async () => {
 *   announce("Loading data...");
 *   const data = await fetchData();
 *   announce("Data loaded successfully");
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Critical error that needs immediate attention
 * const handleError = (error) => {
 *   announce(`Error: ${error.message}`, { priority: "interrupt" });
 * };
 * ```
 *
 * @see {@link AnnounceOptions} for available options
 */
export const useAnnounce = () => {
  const ctx = useContext(AnnouncerContext);
  if (!ctx) throw new Error("useAnnounce must be used within a ScreenReaderAnnouncerProvider");
  return ctx.announce;
};

/**
 * Provider component for screen reader announcements.
 *
 * This component creates an ARIA live region that announces messages to screen readers.
 * It manages a queue of announcements to ensure they are delivered sequentially without
 * overwhelming assistive technology users.
 *
 * **Features:**
 * - Queued announcements (prevents message overlap)
 * - Priority interrupts for critical messages
 * - Delayed announcements for timing control
 * - Debug mode for visual feedback during development
 * - Automatic duplicate message handling
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Child components that will have access to the announcer
 *
 * @example
 * ```tsx
 * // In your root layout or app component
 * import { ScreenReaderAnnouncerProvider } from "~/components/Accessibility/ScreenReaderAnnouncer";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ScreenReaderAnnouncerProvider>
 *           {children}
 *         </ScreenReaderAnnouncerProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Enable debug mode to see announcements visually
 * // Set NEXT_PUBLIC_SR_DEBUG=true in your .env.local
 * // A red banner will appear at the bottom showing current announcements
 * ```
 *
 * @see {@link useAnnounce} for usage in components
 */
export const ScreenReaderAnnouncerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [current, setCurrent] = useState<string>("");
  const idRef = useRef(0);

  const debug = process.env.NEXT_PUBLIC_SR_DEBUG === "true";

  const announce = useCallback((message: string, options?: AnnounceOptions) => {
    setQueue((prev) => {
      const newItem = {
        id: ++idRef.current,
        message,
        delay: options?.delay ?? 0,
      };
      if (options?.priority === "interrupt") return [newItem];
      return [...prev, newItem];
    });
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;

    const [first, ...rest] = queue;
    setCurrent("");

    const delayTimer = setTimeout(() => {
      // Add zero-width space repeated by ID to force screen reader to announce even if message is identical
      // The zero-width space won't be vocalized but will make the DOM content unique
      setCurrent(`${first.message}${"\u200B".repeat(first.id)}`);
    }, first.delay);

    const nextTimer = setTimeout(() => setQueue(rest), first.delay + 1500);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(nextTimer);
    };
  }, [queue]);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      <div
        aria-live="assertive"
        aria-atomic="true"
        role="status"
        className={cn(
          !debug
            ? "sr-only"
            : "pointer-events-none fixed right-0 bottom-0 left-0 z-[10000] grid place-items-center bg-red-500",
        )}
      >
        {current || " "}
      </div>

      {children}
    </AnnouncerContext.Provider>
  );
};
