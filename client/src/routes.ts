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
  [key in PathNames]: string
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
  "/comment-contribuer": "/how-to-contribute",
  "/qui-sommes-nous": "/who-are-we",
  "/mentions-legales": "/legal-notices",
  "/declaration-accessibilite": "/accessibility-statement",
  "/politique-de-confidentialite": "/privacy-policy",
  "/login": "/login",
  "/register": "/register",
  "/reset": "/reset",
  "/backend/[...backend]": "/backend/[...backend]"
}

export const isRoute = (
  currentPath: string,
  pathName: PathNames
) => {
  return currentPath.includes(pathName)
    || currentPath.includes(routes[pathName]);
}

export const getPath = (
  pathName: PathNames,
  locale: string | undefined,
  params?: string
) => {
  return `${locale === "fr" ? pathName : routes[pathName]}${params || ""}`
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

