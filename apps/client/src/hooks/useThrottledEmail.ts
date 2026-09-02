import { logger } from "logger";
import { useCallback, useEffect, useRef, useState } from "react";

export const THROTTLED_EMAIL_DELAY_S = 60;

/** Scopes are independent: a login code does not block a password reset. */
export type ThrottledEmailScope = "send-code" | "reset-password";

const SENT_EVENT = "throttled-email:sent";

const storageKey = (scope: ThrottledEmailScope, email: string) =>
  `${scope}:last-sent:${email.trim().toLowerCase()}`;

const readSecondsLeft = (scope: ThrottledEmailScope, email: string): number => {
  if (typeof window === "undefined" || !email) return 0;
  const raw = window.localStorage.getItem(storageKey(scope, email));
  const sentAt = raw ? Number.parseInt(raw, 10) : 0;
  if (!sentAt || !Number.isFinite(sentAt)) return 0;
  const elapsed = Math.floor((Date.now() - sentAt) / 1000);
  return Math.max(0, THROTTLED_EMAIL_DELAY_S - elapsed);
};

const writeSentAt = (
  scope: ThrottledEmailScope,
  email: string,
  secondsLeft = THROTTLED_EMAIL_DELAY_S,
) => {
  if (typeof window === "undefined" || !email) return;
  // Store the notional send date, so a server-provided retryAfter (429) shifts the
  // countdown instead of restarting it.
  const sentAt = Date.now() - (THROTTLED_EMAIL_DELAY_S - secondsLeft) * 1000;
  window.localStorage.setItem(storageKey(scope, email), sentAt.toString());
  window.dispatchEvent(new CustomEvent(SENT_EVENT));
};

const clearSentAt = (scope: ThrottledEmailScope, email: string) => {
  if (typeof window === "undefined" || !email) return;
  window.localStorage.removeItem(storageKey(scope, email));
  window.dispatchEvent(new CustomEvent(SENT_EVENT));
};

/** Starts the countdown for a send made outside the hook, ie. the initial form. */
export const markThrottledEmailSent = (scope: ThrottledEmailScope, email: string) =>
  writeSentAt(scope, email);

/**
 * Starts the countdown only if none is running. Used by screens only reachable after a
 * send: the countdown runs on arrival and on reload, without sending anything.
 */
export const startThrottleIfIdle = (scope: ThrottledEmailScope, email: string) => {
  if (!email || readSecondsLeft(scope, email) > 0) return;
  writeSentAt(scope, email);
};

/**
 * User-triggered email with 60 seconds between two sends. The delay is shared across
 * mounted components (event) and survives a page change (localStorage). The server
 * stays authoritative and answers 429 with `retryAfter`.
 */
const useThrottledEmail = (
  scope: ThrottledEmailScope,
  email: string,
  send: (email: string) => Promise<unknown>,
) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  // The ref spares callers from having to memoize `send`.
  const sendRef = useRef(send);
  sendRef.current = send;

  useEffect(() => {
    const sync = () => setSecondsLeft(readSecondsLeft(scope, email));
    sync();
    window.addEventListener(SENT_EVENT, sync);
    return () => window.removeEventListener(SENT_EVENT, sync);
  }, [scope, email]);

  const isCountingDown = secondsLeft > 0;
  useEffect(() => {
    if (!isCountingDown) return;
    const timer = window.setInterval(() => setSecondsLeft(readSecondsLeft(scope, email)), 1000);
    return () => window.clearInterval(timer);
  }, [isCountingDown, scope, email]);

  const sendEmail = useCallback(async () => {
    if (!email || readSecondsLeft(scope, email) > 0) return false;
    // Locked before the call to swallow a double click.
    writeSentAt(scope, email);
    try {
      await sendRef.current(email);
      return true;
    } catch (e: any) {
      const retryAfter = e.response?.data?.data?.retryAfter;
      if (e.response?.status === 429 && typeof retryAfter === "number") {
        writeSentAt(scope, email, retryAfter);
      } else {
        logger.error(e);
        // The send failed: let the user retry right away.
        clearSentAt(scope, email);
      }
      return false;
    }
  }, [scope, email]);

  return { sendEmail, secondsLeft, canSend: secondsLeft <= 0 };
};

export default useThrottledEmail;
