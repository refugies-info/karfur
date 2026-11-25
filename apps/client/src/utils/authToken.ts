import Cookies from "js-cookie";

const COOKIE_NAME = "authorization";

const getTokenExpiration = (token: string): Date | undefined => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp ? new Date(payload.exp * 1000) : undefined;
  } catch {
    return undefined;
  }
};

export const setAuthToken = (token: string) => {
  if (token) {
    Cookies.set(COOKIE_NAME, token, {
      expires: getTokenExpiration(token),
      secure: window.location.protocol === "https:",
      sameSite: "lax",
    });
  }
};
export const getAuthToken = (): string | undefined => {
  return Cookies.get(COOKIE_NAME);
};
export const removeAuthToken = () => {
  Cookies.remove(COOKIE_NAME);
};
