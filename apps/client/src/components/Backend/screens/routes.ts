import { RoleName } from "@refugies-info/api-types";
import { Admin } from "./Admin";
import Dashboard from "./Dashboard";
import UserContributions from "./UserContributions";
import UserFavorites from "./UserFavorites";
import UserNotifications from "./UserNotifications";
import UserProfile from "./UserProfile";
import { UserAdminStructure, UserStructure } from "./UserStructure";
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
    name: "Administration",
    component: Dashboard,
    restriction: [RoleName.ADMIN],
  },

  {
    path: "/backend/admin",
    name: "Administration",
    component: Admin,
    restriction: [RoleName.ADMIN],
  },

  {
    path: "/backend/user-dash-contrib",
    name: "Espace rédaction",
    component: UserContributions,
    restriction: [RoleName.USER, RoleName.CONTRIB, RoleName.ADMIN],
  },
  {
    path: "/backend/user-dash-structure",
    name: "Ma structure",
    component: UserStructure,
    restriction: [RoleName.STRUCTURE],
  },
  {
    path: "/backend/user-dash-structure-selected",
    name: " Structure",
    component: UserAdminStructure,
    restriction: [RoleName.ADMIN],
  },
  {
    path: "/backend/user-profile",
    name: "User Profile",
    component: UserProfile,
    restriction: [RoleName.USER, RoleName.ADMIN],
  },
  {
    path: "/backend/user-profile",
    name: "Mon profil",
    component: UserProfile,
    restriction: [RoleName.USER, RoleName.TRAD, RoleName.EXPERT_TRAD, RoleName.ADMIN],
  },
  {
    path: "/backend/user-dash-notifications",
    name: "Mes notifications",
    component: UserNotifications,
    restriction: [RoleName.ADMIN, RoleName.STRUCTURE],
  },
  {
    path: "/backend/user-favorites",
    name: "Mes favoris",
    component: UserFavorites,
    restriction: [RoleName.USER, RoleName.TRAD, RoleName.EXPERT_TRAD, RoleName.ADMIN],
  },
  {
    path: "/backend/user-translation",
    name: "Mes traductions",
    exact: true,
    component: UserTranslation,
    restriction: [RoleName.USER, RoleName.TRAD, RoleName.EXPERT_TRAD, RoleName.ADMIN],
  },
  {
    path: "/backend/user-translation/:id",
    name: "Mes traductions",
    component: UserTranslation,
    restriction: [RoleName.USER, RoleName.TRAD, RoleName.EXPERT_TRAD, RoleName.ADMIN],
  },
];
