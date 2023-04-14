import axios from "axios";
import Cookies from "js-cookie"
const COOKIE_NAME = "authorization";

export const setAuthToken = (token: string) => {
  if (token) {
    Cookies.set(COOKIE_NAME, token); // TODO : set expiration
  }
};
export const getAuthToken = (): string | undefined => {
  return Cookies.get(COOKIE_NAME);
};
export const removeAuthToken = () => {
  Cookies.remove(COOKIE_NAME);
};

/**
 * Set token for calls made by NextJS server
 * @param token jwt token if available
 */
export const setAuthTokenServer = (token: string | undefined) => {
  if (token) {
    //@ts-ignore
    axios.defaults.headers["x-access-token"] = token; // FIXME : set for all users
  }
};
