import HomePage from "./containers/HomePage/HomePage";
import Dashboard from "./containers/Backend/Dashboard/Dashboard";
import Admin from "./containers/Backend/Admin/Admin";
import UserDash from "./containers/Backend/UserDash/UserDash";
import UserDashContrib from "./containers/Backend/UserDashContrib/UserDashContrib";
import UserDashStruct from "./containers/Backend/UserDashStruct/UserDashStruct";
import UserProfile from "./containers/Backend/UserProfile/UserProfile";
import Dispositif from "./containers/Dispositif/Dispositif";
import Avancement from "./containers/Avancement/Avancement";
import Translation from "./containers/Translation/Translation";
import RecordAudio from "./containers/RecordAudio/RecordAudio";
import AdvancedSearch from "./containers/AdvancedSearch/AdvancedSearch";
import QuiSommesNous from "./containers/QuiSommesNous/QuiSommesNous";
import CommentContribuer from "./containers/CommentContribuer/CommentContribuer";
import AdminContenu from "./containers/Backend/AdminContenu/AdminContenu";
import MentionsLegales from "./containers/MentionsLegales/MentionsLegales";
import PolitiqueConfidentialite from "./containers/PolitiqueConfidentialite/PolitiqueConfidentialite";
import { AnnuaireCreate } from "./containers/Annuaire/AnnuaireCreate";

const routes = [
  { path: "/", exact: true, name: "home", restriction: [] },
  { path: "/homepage", name: "Accueil", component: HomePage, restriction: [] },

  {
    path: "/advanced-search",
    name: "Recherche",
    component: AdvancedSearch,
    restriction: [],
  },
  {
    path: "/qui-sommes-nous",
    name: "Qui sommes-nous ?",
    component: QuiSommesNous,
    restriction: [],
  },
  {
    path: "/annuaire-create",
    name: "Annuaire",
    component: AnnuaireCreate,
    restriction: [],
  },
  {
    path: "/comment-contribuer",
    name: "Comment contribuer ?",
    component: CommentContribuer,
    restriction: [],
  },
  {
    path: "/mentions-legales",
    name: "Mentions Légales",
    component: MentionsLegales,
    restriction: [],
  },
  {
    path: "/politique-de-confidentialite",
    name: "Politique de confidentialité",
    component: PolitiqueConfidentialite,
    restriction: [],
  },
  {
    path: "/dispositif/:id",
    exact: true,
    name: "Dispositif",
    component: Dispositif,
    restriction: [],
  },
  {
    path: "/dispositif",
    exact: true,
    name: "Dispositif",
    component: Dispositif,
    restriction: [],
  },

  {
    path: "/demarche/:id",
    exact: true,
    name: "Demarche",
    component: Dispositif,
    restriction: [],
  },
  {
    path: "/demarche",
    exact: true,
    name: "Demarche",
    component: Dispositif,
    restriction: [],
  },

  {
    path: "/avancement/traductions/:id",
    exact: true,
    name: "Avancement",
    component: Avancement,
    restriction: ["ExpertTrad", "Admin"],
  },
  {
    path: "/avancement/langue/:id",
    exact: true,
    name: "Avancement",
    component: Avancement,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/avancement",
    name: "Avancement",
    component: Avancement,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/traduction",
    exact: true,
    name: "Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/traduction/validation/:id",
    exact: true,
    name: "Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/traduction/:id",
    exact: true,
    name: "Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },

  {
    path: "/traduction/string/:id",
    exact: true,
    name: "Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/traduction/dispositif/:id",
    exact: true,
    name: "Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/traduction/demarche/:id",
    exact: true,
    name: "Traduction",
    component: Translation,
    restriction: ["Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/validation/string/:id",
    exact: true,
    name: "Validation",
    component: Translation,
    restriction: ["ExpertTrad", "Admin"],
  },
  {
    path: "/validation/dispositif/:id",
    exact: true,
    name: "Validation",
    component: Translation,
    restriction: ["ExpertTrad", "Admin"],
  },
  {
    path: "/validation/demarche/:id",
    exact: true,
    name: "Validation",
    component: Translation,
    restriction: ["ExpertTrad", "Admin"],
  },

  {
    path: "/record-audio",
    exact: true,
    name: "Enregistrement audio",
    component: RecordAudio,
    restriction: [],
  },

  {
    path: "/backend",
    exact: true,
    forceShow: true,
    name: "Administration",
    component: Dashboard,
    restriction: ["Admin"],
  },
  {
    path: "/backend/admin-dashboard",
    name: "Dashboard",
    component: Dashboard,
    restriction: ["Admin"],
  },
  {
    path: "/backend/admin",
    name: "Administration",
    component: Admin,
    restriction: ["Admin"],
  },
  {
    path: "/backend/admin-contenu",
    name: "AdminContenu",
    component: AdminContenu,
    restriction: ["Admin"],
  },
  {
    path: "/backend/user-dashboard",
    name: "Espace traduction",
    component: UserDash,
    restriction: ["User", "Trad", "ExpertTrad", "Admin"],
  },
  {
    path: "/backend/user-dash-contrib",
    name: "Espace rédaction",
    component: UserDashContrib,
    restriction: ["Contrib", "Admin"],
  },
  {
    path: "/backend/user-dash-structure",
    name: "Ma structure",
    component: UserDashStruct,
    restriction: ["Admin", "hasStructure"],
  },
  {
    path: "/backend/user-dash-structure-selected",
    name: "Structure selectionnée",
    component: UserDashStruct,
    restriction: ["Admin"],
  },
  {
    path: "/backend/user-profile",
    name: "Mon profil",
    component: UserProfile,
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
