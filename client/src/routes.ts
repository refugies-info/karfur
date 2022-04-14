import Dashboard from "./containers/Backend/Dashboard/Dashboard";
import Admin from "./containers/Backend/Admin";
import UserContributions from "./containers/Backend/UserContributions";
import UserProfile from "./containers/Backend/UserProfile";
import Translation from "./containers/Translation/Translation";
import UserNotifications from "./containers/Backend/UserNotifications";
import UserFavorites from "./containers/Backend/UserFavorites";
import {
  UserStructure,
  UserAdminStructure,
} from "./containers/Backend/UserStructure";
import UserTranslation from "./containers/Backend/UserTranslation";

// Frontend
export type PathNames = "/" |
  "/recherche" |
  "/annuaire" |
  "/annuaire/[id]" |
  "/annuaire-creation" |
  "/demarche" |
  "/demarche/[id]" |
  "/dispositif" |
  "/dispositif/[id]" |
  "/comment-contribuer" |
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
  [key in PathNames]: {
    fr: string;
    ln: string;
  };
};

export const routes: Routes = {
  "/": {
    fr: "/",
    ln: "/",
  },
  "/recherche": {
    fr: "/recherche",
    ln: "/advanced-search",
  },
  "/annuaire": {
    fr: "/annuaire",
    ln: "/directory",
  },
  "/annuaire/[id]": {
    fr: "/annuaire/[id]",
    ln: "/directory/[id]",
  },
  "/annuaire-creation": {
    fr: "/annuaire-creation",
    ln: "/directory-create",
  },
  "/demarche": {
    fr: "/demarche",
    ln: "/processe",
  },
  "/demarche/[id]": {
    fr: "/demarche/[id]",
    ln: "/procedure/[id]",
  },
  "/dispositif": {
    fr: "/dispositif",
    ln: "/program",
  },
  "/dispositif/[id]": {
    fr: "/dispositif/[id]",
    ln: "/program/[id]",
  },
  "/comment-contribuer": {
    fr: "/comment-contribuer",
    ln: "/how-to-contribute",
  },
  "/qui-sommes-nous": {
    fr: "/qui-sommes-nous",
    ln: "/who-are-we",
  },
  "/mentions-legales": {
    fr: "/mentions-legales",
    ln: "/legal-notices",
  },
  "/declaration-accessibilite": {
    fr: "/declaration-accessibilite",
    ln: "/accessibility-statement",
  },
  "/politique-de-confidentialite": {
    fr: "/politique-de-confidentialite",
    ln: "/privacy-policy",
  },
  "/login": {
    fr: "/login",
    ln: "/login",
  },
  "/register": {
    fr: "/register",
    ln: "/register",
  },
  "/reset": {
    fr: "/reset",
    ln: "/reset",
  },
  "/backend/[...backend]": {
    fr: "/backend/[...backend]",
    ln: "/backend/[...backend]"
  }
}

export const isRoute = (
  currentPath: string,
  pathName: PathNames
) => {
  return currentPath.includes(routes[pathName].fr)
    || currentPath.includes(routes[pathName].ln);
}

export const getPath = (
  pathName: PathNames,
  locale: string | undefined,
  params?: string
) => {
  const localeKey = locale === "fr" ? "fr" : "ln";
  return routes[pathName][localeKey] + (params || "");
}

// Backend
type Role = "Trad" | "ExpertTrad" | "Admin" | "hasStructure" | "User" | "Contrib";
export type BackendRouteType = {
  path: string,
  exact?: boolean,
  name: string,
  component: any,
  restriction: Role[]
}

export const backendRoutes: BackendRouteType[] = [
  {
    path: "/backend/traduction",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/traduction/validation",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/traduction",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },

  {
    path: "/backend/traduction/string",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/traduction/dispositif",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/traduction/demarche",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/validation/string",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["ExpertTrad", "Admin"],
  },
  {
    path: "/backend/validation/dispositif",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["ExpertTrad", "Admin"],
  },
  {
    path: "/backend/validation/demarche",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["ExpertTrad", "Admin"],
  },
  {
    path: "/backend/dashboard",
    name: "Réfugiés.info - Administration",
    component: Dashboard,
    restriction: ["Admin"],
  },

  {
    path: "/backend/admin",
    name: "Réfugiés.info - Administration",
    component: Admin,
    restriction: ["Admin"],
  },

  {
    path: "/backend/user-dash-contrib",
    name: "Réfugiés.info - Espace rédaction",
    component: UserContributions,
    restriction: ["User", "Contrib", "Admin"],
  },
  {
    path: "/backend/user-dash-structure",
    name: "Réfugiés.info - Ma structure",
    component: UserStructure,
    restriction: ["hasStructure"],
  },
  {
    path: "/backend/user-dash-structure-selected",
    name: "Réfugiés.info -  Structure",
    component: UserAdminStructure,
    restriction: ["Admin"],
  },
  {
    path: "/backend/user-profile",
    name: "Réfugiés.info - Mon profil",
    component: UserProfile,
    restriction: ["User", "Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/user-dash-notifications",
    name: "Réfugiés.info - Mes notifications",
    component: UserNotifications,
    restriction: ["Admin", "hasStructure"],
  },
  {
    path: "/backend/user-favorites",
    name: "Réfugiés.info - Mes favoris",
    component: UserFavorites,
    restriction: ["User", "Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/user-translation",
    name: "Réfugiés.info - Mes traductions",
    exact: true,
    component: UserTranslation,
    restriction: ["User", "Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/user-translation/:id",
    name: "Réfugiés.info - Mes traductions",
    component: UserTranslation,
    restriction: ["User", "Trad", "ExpertTrad", "Admin"],
  },
];

