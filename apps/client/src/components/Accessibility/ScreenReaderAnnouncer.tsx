"use client";
import { cn } from "@refugies-info/ui";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

type AnnounceOptions = {
  priority?: "interrupt" | "normal";
  delay?: number;
};

type QueueItem = {
  id: number;
  message: string;
  delay: number;
};

type AnnouncerContextType = {
  announce: (message: string, options?: AnnounceOptions) => void;
};

const AnnouncerContext = createContext<AnnouncerContextType | null>(null);

export const useAnnounce = () => {
  const ctx = useContext(AnnouncerContext);
  if (!ctx) throw new Error("useAnnounce must be used within a ScreenReaderAnnouncerProvider");
  return ctx.announce;
};

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
