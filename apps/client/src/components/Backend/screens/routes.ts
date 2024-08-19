import { RoleName } from "@refugies-info/api-types";
import Dashboard from "./Dashboard";
import { Admin } from "./Admin";
import UserContributions from "./UserContributions";
import UserProfile from "./UserProfile";
import UserNotifications from "./UserNotifications";
import UserFavorites from "./UserFavorites";
import { UserStructure, UserAdminStructure } from "./UserStructure";
import UserTranslation from "./UserTranslation";

export type BackendRouteType = {
  path: string;
  exact?: boolean;
  name: string;
  component: any;
  restriction: RoleName[];
};

export const backendRoutes: BackendRouteType[] = [
  {
    path: "/backend/dashboard",
    name: "Administration - Réfugiés.info",
    component: Dashboard,
    restriction: [RoleName.ADMIN],
  },

  {
    path: "/backend/admin",
    name: "Administration - Réfugiés.info",
    component: Admin,
    restriction: [RoleName.ADMIN],
  },

  {
    path: "/backend/user-dash-contrib",
    name: "Espace rédaction - Réfugiés.info",
    component: UserContributions,
    restriction: [RoleName.USER, RoleName.CONTRIB, RoleName.ADMIN],
  },
  {
    path: "/backend/user-dash-structure",
    name: "Ma structure - Réfugiés.info",
    component: UserStructure,
    restriction: [RoleName.STRUCTURE],
  },
  {
    path: "/backend/user-dash-structure-selected",
    name: " Structure - Réfugiés.info",
    component: UserAdminStructure,
    restriction: [RoleName.ADMIN],
  },
  {
    path: "/backend/user-profile",
    name: "Mon profil - Réfugiés.info",
    component: UserProfile,
    restriction: [RoleName.USER, RoleName.TRAD, RoleName.EXPERT_TRAD, RoleName.ADMIN],
  },
  {
    path: "/backend/user-dash-notifications",
    name: "Mes notifications - Réfugiés.info",
    component: UserNotifications,
    restriction: [RoleName.ADMIN, RoleName.STRUCTURE],
  },
  {
    path: "/backend/user-favorites",
    name: "Mes favoris - Réfugiés.info",
    component: UserFavorites,
    restriction: [RoleName.USER, RoleName.TRAD, RoleName.EXPERT_TRAD, RoleName.ADMIN],
  },
  {
    path: "/backend/user-translation",
    name: "Mes traductions - Réfugiés.info",
    exact: true,
    component: UserTranslation,
    restriction: [RoleName.USER, RoleName.TRAD, RoleName.EXPERT_TRAD, RoleName.ADMIN],
  },
  {
    path: "/backend/user-translation/:id",
    name: "Mes traductions - Réfugiés.info",
    component: UserTranslation,
    restriction: [RoleName.USER, RoleName.TRAD, RoleName.EXPERT_TRAD, RoleName.ADMIN],
  },
];
