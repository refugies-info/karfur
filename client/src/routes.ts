export type PathNames =
  "/" |
  "/recherche" |
  "/annuaire" |
  "/annuaire/[id]" |
  "/annuaire-creation" |
  "/demarche" |
  "/demarche/[id]" |
  "/dispositif" |
  "/dispositif/[id]" |
  "/publier" |
  "/traduire" |
  "/qui-sommes-nous" |
  "/mentions-legales" |
  "/declaration-accessibilite" |
  "/politique-de-confidentialite" |
  "/login" |
  "/register" |
  "/reset" |
  "/backend/[...backend]"
  ;

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
  "/dispositif": "/program",
  "/dispositif/[id]": "/program/[id]",
  "/publier": "/publish",
  "/traduire": "/translate",
  "/qui-sommes-nous": "/who-are-we",
  "/mentions-legales": "/legal-notices",
  "/declaration-accessibilite": "/accessibility-statement",
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
