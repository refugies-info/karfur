import Cookies from "js-cookie";

const UTMZ_COOKIE_NAME = "__utmz";

const listeners = new Set<() => void>();

export const readUtmzCookie = (): string | null => Cookies.get(UTMZ_COOKIE_NAME) || null;

export const subscribeToUtmzCookie = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const writeUtmzCookie = (value: string, expires: Date) => {
  document.cookie = `${UTMZ_COOKIE_NAME}=${value}; path=/; expires=${expires.toUTCString()}`;
  listeners.forEach((listener) => listener());
};
