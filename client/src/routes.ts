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

type Role = "Trad" | "ExpertTrad" | "Admin" | "hasStructure" | "User" | "Contrib";
export type RouteType = {
  path: string,
  exact?: boolean,
  name: string,
  component: any,
  restriction: Role[]
}

const routes: RouteType[] = [
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
export default routes;
