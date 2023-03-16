export type PathNames =
  | "/"
  | "/recherche"
  | "/annuaire"
  | "/annuaire/[id]"
  | "/annuaire-creation"
  | "/demarche"
  | "/demarche/[id]"
  | "/demarche/[id]/edit"
  | "/dispositif"
  | "/dispositif/[id]"
  | "/dispositif/[id]/edit"
  | "/publier"
  | "/traduire"
  | "/qui-sommes-nous"
  | "/mentions-legales"
  | "/declaration-accessibilite"
  | "/politique-de-confidentialite"
  | "/plan-du-site"
  | "/login"
  | "/register"
  | "/reset"
  | "/backend/[...backend]";

type Routes = {
  [key in PathNames]: string;
};

const routes: Routes = {
  "/": "/",
  "/recherche": "/advanced-search",
  "/annuaire": "/directory",
  "/annuaire/[id]": "/directory/[id]",
  "/annuaire-creation": "/directory-create",
  "/demarche": "/processe",
  "/demarche/[id]": "/procedure/[id]",
  "/demarche/[id]/edit": "/procedure/[id]/edit",
  "/dispositif": "/program",
  "/dispositif/[id]": "/program/[id]",
  "/dispositif/[id]/edit": "/program/[id]/edit",
  "/publier": "/publish",
  "/traduire": "/translate",
  "/qui-sommes-nous": "/who-are-we",
  "/mentions-legales": "/legal-notices",
  "/declaration-accessibilite": "/accessibility-statement",
  "/plan-du-site": "/sitemap",
  "/politique-de-confidentialite": "/privacy-policy",
  "/login": "/login",
  "/register": "/register",
  "/reset": "/reset",
  "/backend/[...backend]": "/backend/[...backend]"
};

export const isRoute = (currentPath: string, pathName: PathNames) => {
  return currentPath.includes(pathName) || currentPath.includes(routes[pathName]);
};

export const getPath = (pathName: PathNames, locale: string | undefined, params?: string) => {
  const path = locale === "fr" ? pathName : routes[pathName];
  return `${path || pathName}${params || ""}`;
};
