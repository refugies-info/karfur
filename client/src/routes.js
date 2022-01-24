/* import HomePage from "./containers/HomePage/HomePage";
import DownloadApp from "./containers/DownloadApp/DownloadApp";
import Dispositif from "./containers/Dispositif/Dispositif";
import AdvancedSearch from "./containers/AdvancedSearch/AdvancedSearch";
import QuiSommesNous from "./containers/QuiSommesNous/QuiSommesNous";
import CommentContribuer from "./containers/CommentContribuer/CommentContribuer";
import MentionsLegales from "./containers/MentionsLegales/MentionsLegales";
import PolitiqueConfidentialite from "./containers/PolitiqueConfidentialite/PolitiqueConfidentialite";
import { AnnuaireCreate } from "./containers/Annuaire/AnnuaireCreate";
import { AnnuaireLecture, AnnuaireDetail } from "./containers/Annuaire/AnnuaireLecture"; */
import Dashboard from "./containers/Backend/Dashboard/Dashboard";
import { Admin } from "./containers/Backend/Admin/Admin";
import { UserContributions } from "./containers/Backend/UserContributions";
import { UserProfile } from "./containers/Backend/UserProfile";
import Translation from "./containers/Translation/Translation";
import { UserNotifications } from "./containers/Backend/UserNotifications";
import { UserFavorites } from "./containers/Backend/UserFavorites";
import {
  UserStructure,
  UserAdminStructure,
} from "./containers/Backend/UserStructure";
import { UserTranslation } from "./containers/Backend/UserTranslation";

const routes = [
  /* {
    path: "/",
    exact: true,
    name: "Réfugiés.info",
    component: HomePage,
    restriction: [],
  },
  {
    path: "/homepage",
    name: "Réfugiés.info - Accueil",
    component: HomePage,
    restriction: [],
  },
  {
    path: "/advanced-search",
    name: "Réfugiés.info - Recherche",
    component: AdvancedSearch,
    restriction: [],
  },
  {
    path: "/qui-sommes-nous",
    name: "Réfugiés.info - Qui sommes-nous ?",
    component: QuiSommesNous,
    restriction: [],
  },
  {
    path: "/annuaire-create",
    name: "Réfugiés.info - Annuaire",
    component: AnnuaireCreate,
    restriction: [],
  },
  {
    path: "/annuaire",
    exact: true,
    name: "Réfugiés.info - Annuaire",
    component: AnnuaireLecture,
    restriction: [],
  },
  {
    path: "/annuaire/:id",
    name: "Réfugiés.info - Annuaire",
    exact: true,
    component: AnnuaireDetail,
    restriction: [],
  },
  {
    path: "/comment-contribuer",
    name: "Réfugiés.info - Comment contribuer ?",
    component: CommentContribuer,
    restriction: [],
  },
  {
    path: "/mentions-legales",
    name: "Réfugiés.info - Mentions Légales",
    component: MentionsLegales,
    restriction: [],
  },
  {
    path: "/politique-de-confidentialite",
    name: "Réfugiés.info - Politique de confidentialité",
    component: PolitiqueConfidentialite,
    restriction: [],
  },
  {
    path: "/dispositif/:id",
    exact: true,
    name: "Réfugiés.info - Dispositif",
    component: Dispositif,
    restriction: [],
  },
  {
    path: "/dispositif",
    exact: true,
    name: "Réfugiés.info - Dispositif",
    component: Dispositif,
    restriction: [],
  },

  {
    path: "/demarche/:id",
    exact: true,
    name: "Réfugiés.info - Démarche",
    component: Dispositif,
    restriction: [],
  },
  {
    path: "/demarche",
    exact: true,
    name: "Réfugiés.info - Démarche",
    component: Dispositif,
    restriction: [],
  },
  {
    path: "/download-app",
    name: "Réfugiés.info - Télécharger l'application",
    component: DownloadApp,
    restriction: [],
  }, */

  {
    path: "/traduction",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/traduction/validation/:id",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/traduction/:id",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },

  {
    path: "/traduction/string/:id",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/traduction/dispositif/:id",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/traduction/demarche/:id",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/validation/string/:id",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["ExpertTrad", "Admin"],
  },
  {
    path: "/validation/dispositif/:id",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["ExpertTrad", "Admin"],
  },
  {
    path: "/validation/demarche/:id",
    exact: true,
    name: "Réfugiés.info - Traduction",
    component: Translation,
    restriction: ["ExpertTrad", "Admin"],
  },

  {
    path: "/backend/dashboard",
    exact: true,
    forceShow: true,
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
    path: "/backend",
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

const simplesRoutes = routes.map((x) => ({
  path: x.path,
  name: x.name,
  restriction: x.restriction,
}));
export { simplesRoutes };

export default routes;
