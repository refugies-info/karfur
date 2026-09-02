/**
 * Throttles user-triggered emails (login code, password reset link): one send per
 * address and per scope every 60 seconds. Stored in memory, so this only holds for a
 * single API instance - moving it to redis is a follow-up iteration.
 */
export const EMAIL_THROTTLE_DELAY_MS = 60_000;

/** Scopes are independent: asking for a login code does not block a password reset. */
export type EmailThrottleScope = "send-code" | "reset-password";

const lastSentAt = new Map<string, number>();

const buildKey = (scope: EmailThrottleScope, email: string) =>
  `${scope}:${email.trim().toLowerCase()}`;

/** Drops expired entries so the Map does not grow forever. */
const prune = (now: number) => {
  for (const [key, sentAt] of lastSentAt) {
    if (now - sentAt >= EMAIL_THROTTLE_DELAY_MS) lastSentAt.delete(key);
  }
};

/** Seconds to wait before a new send, 0 when the send is allowed. */
export const getRetryAfter = (
  scope: EmailThrottleScope,
  email: string,
  now = Date.now(),
): number => {
  const sentAt = lastSentAt.get(buildKey(scope, email));
  if (!sentAt) return 0;
  const remaining = EMAIL_THROTTLE_DELAY_MS - (now - sentAt);
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};

export const markSent = (scope: EmailThrottleScope, email: string, now = Date.now()) => {
  prune(now);
  lastSentAt.set(buildKey(scope, email), now);
};

/** Releases the lock when the send failed: the user must be able to retry. */
export const clearSent = (scope: EmailThrottleScope, email: string) => {
  lastSentAt.delete(buildKey(scope, email));
};

/** Tests only. */
export const resetEmailThrottle = () => lastSentAt.clear();
