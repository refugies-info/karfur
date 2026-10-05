import { phone as parsePhone } from "phone";

/**
 * Caps the SMS sent to a single recipient: SMS_THROTTLE_MAX_PER_WINDOW per window.
 * Stored in memory, so this only holds for a single API instance
 */
export const SMS_THROTTLE_WINDOW_MS = 60 * 60 * 1000;
export const SMS_THROTTLE_MAX_PER_WINDOW = 5;

const sentAtByRecipient = new Map<string, number[]>();

/** Same number written differently (+33 6.., 06..) must share one counter. */
const buildKey = (phone: string): string => {
  const international = parsePhone(phone, { country: null });
  if (international.isValid) return international.phoneNumber;
  const french = parsePhone(phone, { country: "FR" });
  return french.isValid ? french.phoneNumber : phone.replace(/\s/g, "");
};

const recentSends = (key: string, now: number): number[] =>
  (sentAtByRecipient.get(key) || []).filter((sentAt) => now - sentAt < SMS_THROTTLE_WINDOW_MS);

/** Drops expired entries so the Map does not grow forever. */
const refreshRecentSent = (now: number) => {
  for (const key of sentAtByRecipient.keys()) {
    const recent = recentSends(key, now);
    if (recent.length) sentAtByRecipient.set(key, recent);
    else sentAtByRecipient.delete(key);
  }
};

/** Seconds to wait before a new send, 0 when the send is allowed. */
export const getSmsRetryAfter = (phone: string, now = Date.now()): number => {
  const recent = recentSends(buildKey(phone), now);
  if (recent.length < SMS_THROTTLE_MAX_PER_WINDOW) return 0;
  return Math.ceil((recent[0] + SMS_THROTTLE_WINDOW_MS - now) / 1000);
};

export const markSmsSent = (phone: string, now = Date.now()) => {
  refreshRecentSent(now);
  const key = buildKey(phone);
  sentAtByRecipient.set(key, [...recentSends(key, now), now]);
};

/** Releases the slot when the send failed: the user must be able to retry. */
export const clearLastSmsSent = (phone: string) => {
  const key = buildKey(phone);
  const sends = sentAtByRecipient.get(key);
  if (!sends) return;
  sends.pop();
  if (!sends.length) sentAtByRecipient.delete(key);
};

/** Tests only. */
export const resetSmsThrottle = () => sentAtByRecipient.clear();
