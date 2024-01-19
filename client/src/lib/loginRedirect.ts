const REDIRECT_KEY = "login_redirect";

/**
 * Save current page to redirect to in session storage.
 * @param extraParam add param to current page for redirection
 */
export const setLoginRedirect = (extraParam: Record<string, string> = {}) => {
  const currentPath = window.location.pathname;
  const newQueryString = Object.entries(extraParam).map(p => `${p[0]}=${p[1]}`).join("&");
  const redirectTo = currentPath.includes("?") ? currentPath + newQueryString : currentPath + "?" + newQueryString;
  sessionStorage.setItem(REDIRECT_KEY, redirectTo);
}

/**
 * Returns page to redirect to
 */
export const getLoginRedirect = () => {
  const storedPage = sessionStorage.getItem(REDIRECT_KEY);
  if (storedPage) return storedPage;
  // TODO : return depending on role
  return "/"
}
