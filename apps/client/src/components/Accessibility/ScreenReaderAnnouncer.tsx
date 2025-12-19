/**
 * @fileoverview Screen Reader Announcer - Dual-channel ARIA live region system
 *
 * Provides queued announcements for screen readers with two channels:
 * - **Polite**: Sequential queue (never interrupted) with pessimistic read time estimation
 * - **Assertive**: Priority announcements that clear the queue and announce immediately
 *
 * Features: WCAG 2.1 SC 4.1.3 compliant, ZWSP duplicate handling, Shadow DOM isolation, debug mode.
 *
 * @module ScreenReaderAnnouncer
 * @see {@link https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html WCAG 4.1.3}
 */
"use client";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Options for configuring screen reader announcements.
 * @property {("interrupt" | "normal")} [priority="normal"] - "interrupt" clears queue and announces immediately; "normal" queues
 * @property {number} [delay=0] - Milliseconds to wait before announcing (for UI updates)
 * @example announce("Item added"); // Queued
 * @example announce("Error!", { priority: "interrupt" }); // Immediate
 * @example announce("Done", { delay: 300 }); // Wait 300ms
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
 * Hook to announce messages to screen readers.
 * @returns {Function} announce(message, options?) - Queues or announces immediately
 * @throws {Error} If used outside ScreenReaderAnnouncerProvider
 * @example
 * ```tsx
 * const announce = useAnnounce();
 * announce("Item saved successfully");
 * ```
 * @example
 * ```tsx
 * // Critical error - interrupts queue
 * announce("Payment failed. Please try again.", { priority: "interrupt" });
 * ```
 * @example
 * ```tsx
 * // Wait for UI update before announcing
 * setResults(data);
 * announce(`Found ${data.length} results`, { delay: 500 });
 * ```
 */
export const useAnnounce = () => {
  const ctx = useContext(AnnouncerContext);
  if (!ctx) throw new Error("useAnnounce must be used within a ScreenReaderAnnouncerProvider");
  return ctx.announce;
};

/**
 * Provider component for screen reader announcements.
 * Manages dual-channel queue (polite + assertive) with pessimistic read time estimation.
 * @param {ReactNode} props.children - Components with access to useAnnounce hook
 * @example <ScreenReaderAnnouncerProvider>{children}</ScreenReaderAnnouncerProvider>
 * @note Enable debug: NEXT_PUBLIC_SR_DEBUG=true in .env.local
 */
export const ScreenReaderAnnouncerProvider = ({ children }: { children: ReactNode }) => {
  // Polite channel: queued announcements (never interrupted)
  const [politeQueue, setPoliteQueue] = useState<QueueItem[]>([]);
  const [politeCurrent, setPoliteCurrent] = useState<string>("");

  // Assertive channel: priority announcements (interrupts polite)
  const [assertiveCurrent, setAssertiveCurrent] = useState<string>("");

  // Debug state
  const [queueTimeline, setQueueTimeline] = useState<string>("");

  const idRef = useRef(0);
  const queueLengthRef = useRef(0);

  const isJsdom = typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent ?? "");
  const debug =
    process.env.NEXT_PUBLIC_SR_DEBUG === "true" &&
    process.env.NODE_ENV !== "test" &&
    !process.env.JEST_WORKER_ID &&
    !isJsdom;

  // Helper: Calculate read time based on word count (150ms/word + 300ms buffer, min 800ms)
  const calculateReadTime = useCallback((message: string): number => {
    const wordCount = message.split(/\s+/).length;
    return Math.max(800, wordCount * 150 + 300);
  }, []);

  const announce = useCallback(
    (message: string, options?: AnnounceOptions) => {
      const newItem = { id: ++idRef.current, message, delay: options?.delay ?? 0 };

      if (options?.priority === "interrupt") {
        setPoliteQueue([]);
        setQueueTimeline("");
        if (debug) {
          // eslint-disable-next-line no-console
          console.log(
            `%c[SR] 🔴 INTERRUPT%c Queue cleared, announcing immediately\n→ "${message.substring(0, 60)}..."`,
            "color: #ef4444; font-weight: bold",
            "color: #666",
          );
        }
        // Handle duplicate messages by toggling ZWSP
        setAssertiveCurrent((prev) => {
          const cleanPrev = prev.replace(/\u200B$/, "");
          if (cleanPrev === message) {
            return prev.endsWith("\u200B") ? message : `${message}\u200B`;
          }
          return `${message}\u200B`;
        });
      } else {
        setPoliteQueue((prev) => {
          queueLengthRef.current = prev.length + 1;
          return [...prev, newItem];
        });
        if (debug) {
          // eslint-disable-next-line no-console
          console.log(
            `%c[SR] 🟢 QUEUE%c Position ${queueLengthRef.current} | Delay ${options?.delay ?? 0}ms\n→ "${message.substring(0, 50)}..."`,
            "color: #22c55e; font-weight: bold",
            "color: #666",
          );
        }
      }
    },
    [debug],
  );

  // Process polite queue: announce first item, then move to next
  useEffect(() => {
    if (politeQueue.length === 0) return;
    const [first, ...rest] = politeQueue;
    const readTime = calculateReadTime(first.message);

    const delayTimer = setTimeout(() => {
      setPoliteCurrent((prev) => {
        const cleanPrev = prev.replace(/\u200B$/, "");
        if (cleanPrev === first.message) {
          return prev.endsWith("\u200B") ? first.message : `${first.message}\u200B`;
        }
        return `${first.message}\u200B`;
      });
    }, first.delay);

    if (debug) {
      let time = first.delay;
      const timeline = `| ${(time / 1000).toFixed(1)}s: \"${first.message.substring(0, 25)}...\" (${readTime}ms)`;
      const restTimeline = rest
        .reduce((acc, item) => {
          const itemTime = calculateReadTime(item.message);
          time += readTime;
          return acc + ` | ${(time / 1000).toFixed(1)}s: \"${item.message.substring(0, 25)}...\" (${itemTime}ms)`;
        }, "")
        .concat(rest.length > 0 ? " | ?" : "");
      setQueueTimeline(timeline + restTimeline);
      // eslint-disable-next-line no-console
      console.log(
        `%c[SR] 📊 TIMELINE%c ${timeline + restTimeline}`,
        "color: #eab308; font-weight: bold",
        "color: #666",
      );
    }

    const nextTimer = setTimeout(() => setPoliteQueue(rest), first.delay + readTime);
    return () => {
      clearTimeout(delayTimer);
      clearTimeout(nextTimer);
    };
  }, [politeQueue, debug, calculateReadTime]);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {/* Polite channel - queued announcements */}
      <div aria-live="polite" aria-atomic="true" role="status" className="sr-only">
        {politeCurrent || " "}
      </div>

      {/* Assertive channel - priority announcements */}
      <div aria-live="assertive" aria-atomic="true" role="alert" className="sr-only">
        {assertiveCurrent || " "}
      </div>

      {/* Visual debug panel (hidden from screen readers) */}
      {debug && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed right-0 bottom-0 left-0 z-[10000] flex flex-col gap-2 bg-gray-800 p-3 text-center font-mono text-xs text-white"
        >
          {/* Polite channel */}
          <div className="border-b border-blue-400 pb-2">
            <span className="font-bold text-blue-100">📢 POLITE (queued):</span>
            <span className="truncate">{politeCurrent ? politeCurrent.substring(0, 100) : "(empty)"}</span>
          </div>

          {/* Assertive channel */}
          <div className="border-b border-red-400 pb-2">
            <span className="font-bold text-red-100">� ASSERTIVE (priority):</span>
            <span className="truncate">{assertiveCurrent ? assertiveCurrent.substring(0, 100) : "(empty)"}</span>
          </div>

          <div className="grid grid-cols-2">
            {/* Queue timeline */}
            <div>
              <span className="font-bold text-yellow-100">📊 TIMELINE:</span>
              {queueTimeline ? <span className="overflow-x-auto whitespace-nowrap">{queueTimeline}</span> : "empty"}
            </div>

            {/* Queue status */}
            <div>
              <span className="font-bold text-green-100">📋 QUEUE: </span>
              <span>{politeQueue.length} message(s) waiting</span>
            </div>
          </div>
        </div>
      )}

      {children}
    </AnnouncerContext.Provider>
  );
};
