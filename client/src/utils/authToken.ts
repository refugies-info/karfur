import Cookies from "js-cookie"
// import jwt_decode from "jwt-decode";

const COOKIE_NAME = "authorization";

export const setAuthToken = (token: string) => {
  if (token) {
    // const decoded = jwt_decode(token);
    Cookies.set(COOKIE_NAME, token, { expires: 365 }); // TODO : set expiration, not available in token
  }
};
export const getAuthToken = (): string | undefined => {
  return Cookies.get(COOKIE_NAME);
};
export const removeAuthToken = () => {
  Cookies.remove(COOKIE_NAME);
};
