import { GetUserInfoResponse, RoleName } from "@refugies-info/api-types";
import { getPath } from "routes";

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
export const getLoginRedirect = (roles: GetUserInfoResponse["roles"] | undefined) => {
  const storedPage = sessionStorage.getItem(REDIRECT_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  if (storedPage) return storedPage;
  if (!roles || roles.length === 0) return "/";

  const roleNames = roles.map(r => r.nom);
  if (roleNames.includes(RoleName.ADMIN)) return "/backend/admin"
  // if (roleNames.includes("TS")) return "/" // TODO: update role
  if (roleNames.includes(RoleName.EXPERT_TRAD) || roleNames.includes(RoleName.TRAD)) return getPath("/traduire", "fr")
  if (roleNames.includes(RoleName.CONTRIB)) return getPath("/publier", "fr")
  return getPath("/recherche", "fr")
}
