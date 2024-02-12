import { GetUserInfoResponse, RoleName } from "@refugies-info/api-types";
import { getPath } from "routes";

const REDIRECT_KEY = "login_redirect";
const REGISTER_KEY = "register_infos";

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
  sessionStorage.removeItem(REGISTER_KEY);
  if (storedPage) return storedPage;
  if (!roles || roles.length === 0) return "/";

  const roleNames = roles.map(r => r.nom);
  if (roleNames.includes(RoleName.ADMIN)) return "/backend/admin"
  if (roleNames.includes(RoleName.CAREGIVER)) return getPath("/recherche", "fr")
  if (roleNames.includes(RoleName.EXPERT_TRAD) || roleNames.includes(RoleName.TRAD)) return getPath("/traduire", "fr")
  if (roleNames.includes(RoleName.CONTRIB)) return getPath("/publier", "fr")
  return getPath("/recherche", "fr")
}

export const getInscriptionMessage = (loginRedirect: string) => {
  if (loginRedirect.includes("recherche")) return "Vous aurez bientôt accès à votre contenu personnalisé !";
  if (loginRedirect.includes("publier")) return "Vous pourrez bientôt commencer à rédiger !";
  if (loginRedirect.includes("traduire")) return "Vous pourrez bientôt commencer à traduire !";
  if (loginRedirect.includes("dispositif") || loginRedirect.includes("demarche")) return "Vous pourrez bientôt reprendre votre lecture !";
  return "";
}


interface RegisterInfos {
  role?: RoleName.CONTRIB | RoleName.TRAD;
}
/**
 * Save informations to use at registration time
 * @param role - role to add to the user at registration
 */
export const setRegisterInfos = (role: RegisterInfos) => {
  sessionStorage.setItem(REGISTER_KEY, JSON.stringify(role));
}

/**
 * Get registration from the session storage
 * @returns infos if available
 */
export const getRegisterInfos = (): RegisterInfos | null => {
  const data = sessionStorage.getItem(REGISTER_KEY);
  if (data) {
    sessionStorage.removeItem(REGISTER_KEY);
    return JSON.parse(data) as RegisterInfos;
  }
  return null;
}
