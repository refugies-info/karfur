import Dashboard from "containers/Backend/Dashboard/Dashboard";
import Admin from "containers/Backend/Admin";
import UserContributions from "containers/Backend/UserContributions";
import UserProfile from "containers/Backend/UserProfile";
import UserNotifications from "containers/Backend/UserNotifications";
import UserFavorites from "containers/Backend/UserFavorites";
import { UserStructure, UserAdminStructure } from "containers/Backend/UserStructure";
import UserTranslation from "containers/Backend/UserTranslation";
import { NewTranslation } from "containers";

type Role = "Trad" | "ExpertTrad" | "Admin" | "hasStructure" | "User" | "Contrib";
export type BackendRouteType = {
  path: string;
  exact?: boolean;
  name: string;
  component: any;
  restriction: Role[];
};

export const backendRoutes: BackendRouteType[] = [
  {
    path: "/backend/traduction/validation",
    exact: true,
    name: "Traduction - Réfugiés.info",
    component: NewTranslation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/traduction",
    exact: true,
    name: "Traduction - Réfugiés.info",
    component: NewTranslation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },

  {
    path: "/backend/traduction/dispositif",
    exact: true,
    name: "Traduction - Réfugiés.info",
    component: NewTranslation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/traduction/demarche",
    exact: true,
    name: "Traduction - Réfugiés.info",
    component: NewTranslation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/validation/dispositif",
    exact: true,
    name: "Traduction - Réfugiés.info",
    component: NewTranslation,
    restriction: ["ExpertTrad", "Admin"],
  },
  {
    path: "/backend/validation/demarche",
    exact: true,
    name: "Traduction - Réfugiés.info",
    component: NewTranslation,
    restriction: ["ExpertTrad", "Admin"],
  },
  {
    path: "/backend/dashboard",
    name: "Administration - Réfugiés.info",
    component: Dashboard,
    restriction: ["Admin"],
  },

  {
    path: "/backend/admin",
    name: "Administration - Réfugiés.info",
    component: Admin,
    restriction: ["Admin"],
  },

  {
    path: "/backend/user-dash-contrib",
    name: "Espace rédaction - Réfugiés.info",
    component: UserContributions,
    restriction: ["User", "Contrib", "Admin"],
  },
  {
    path: "/backend/user-dash-structure",
    name: "Ma structure - Réfugiés.info",
    component: UserStructure,
    restriction: ["hasStructure"],
  },
  {
    path: "/backend/user-dash-structure-selected",
    name: " Structure - Réfugiés.info",
    component: UserAdminStructure,
    restriction: ["Admin"],
  },
  {
    path: "/backend/user-profile",
    name: "Mon profil - Réfugiés.info",
    component: UserProfile,
    restriction: ["User", "Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/user-dash-notifications",
    name: "Mes notifications - Réfugiés.info",
    component: UserNotifications,
    restriction: ["Admin", "hasStructure"],
  },
  {
    path: "/backend/user-favorites",
    name: "Mes favoris - Réfugiés.info",
    component: UserFavorites,
    restriction: ["User", "Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/user-translation",
    name: "Mes traductions - Réfugiés.info",
    exact: true,
    component: UserTranslation,
    restriction: ["User", "Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/user-translation/:id",
    name: "Mes traductions - Réfugiés.info",
    component: UserTranslation,
    restriction: ["User", "Trad", "ExpertTrad", "Admin"],
  },
];
