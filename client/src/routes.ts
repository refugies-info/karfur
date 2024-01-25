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
  | "/backend/[...backend]"
  | "/auth"
  | "/auth/connexion"
  | "/auth/code-connexion"
  | "/auth/code-securite"
  | "/auth/inscription"
  | "/auth/inscription/objectif"
  | "/auth/inscription/langue"
  | "/auth/inscription/pseudo"
  | "/auth/inscription/structure"
  | "/auth/inscription/territoire"
  | "/auth/reinitialiser-mot-de-passe"
  | "/auth/reinitialiser-mot-de-passe/mail-envoye"
  | "/auth/reinitialiser-mot-de-passe/nouveau"
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
  "/backend/[...backend]": "/backend/[...backend]",
  "/auth": "/auth",
  "/auth/connexion": "/auth/connexion",
  "/auth/code-connexion": "/auth/code-connexion",
  "/auth/code-securite": "/auth/code-securite",
  "/auth/inscription": "/auth/inscription",
  "/auth/inscription/objectif": "/auth/inscription/objectif",
  "/auth/inscription/langue": "/auth/inscription/langue",
  "/auth/inscription/pseudo": "/auth/inscription/pseudo",
  "/auth/inscription/structure": "/auth/inscription/structure",
  "/auth/inscription/territoire": "/auth/inscription/territoire",
  "/auth/reinitialiser-mot-de-passe": "/auth/reinitialiser-mot-de-passe",
  "/auth/reinitialiser-mot-de-passe/mail-envoye": "/auth/reinitialiser-mot-de-passe/mail-envoye",
  "/auth/reinitialiser-mot-de-passe/nouveau": "/auth/reinitialiser-mot-de-passe/nouveau"
};

export const isRoute = (currentPath: string, pathName: PathNames) => {
  return currentPath.includes(pathName) || currentPath.includes(routes[pathName]);
};

export const getPath = (pathName: PathNames, locale: string | undefined, params?: string) => {
  const path = locale === "fr" ? pathName : routes[pathName];
  return `${path || pathName}${params || ""}`;
};
