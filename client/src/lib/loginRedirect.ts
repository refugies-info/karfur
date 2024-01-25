const REDIRECT_KEY = "login_redirect";

/**
 * Save current page to redirect to in session storage.
 * @param extraParam add param to current page for redirection
 */
export const setLoginRedirect = (extraParam: Record<string, string> | string | null = null) => {
  const currentPath = window.location.pathname + window.location.search;
  let pathSuffix = "";
  if (extraParam) {
    if (typeof extraParam === "object") {
      const stringParams = Object.entries(extraParam).map(p => `${p[0]}=${p[1]}`).join("&");
      pathSuffix = window.location.search ? `&${stringParams}` : `?${stringParams}`;
    }
    if (typeof extraParam === "string") {
      pathSuffix = extraParam;
    }
  }
  sessionStorage.setItem(REDIRECT_KEY, currentPath + pathSuffix);
}

/**
 * Returns page to redirect to
 */
export const getLoginRedirect = () => {
  const storedPage = sessionStorage.getItem(REDIRECT_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  if (storedPage) return storedPage;
  // TODO : return depending on role
  return "/"
}
