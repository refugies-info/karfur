import DefaultLayout from './containers/Layout/Layout';

import HomePage from './containers/HomePage/HomePage';
import Forms from './views/Base/Forms';
import WelcomeParcours from './views/Base/WelcomeParcours';
import Parcours from './views/Base/Parcours';
import Dashboard from './containers/Backend/Dashboard/Dashboard';
import Admin from './containers/Backend/Admin/Admin';
import UserDash from './containers/Backend/UserDash/UserDash';
import UserForm from './containers/Backend/UserDash/UserForm/UserForm';
import UserProfile from './containers/Backend/UserProfile/UserProfile';
import AdminLangues from './containers/Backend/AdminLangues/AdminLangues';

import Chat from './containers/Backend/Chat/Chat';
import Articles from './containers/Articles/Articles';
import Article from './containers/Article/Article';
import Dispositifs from './containers/Dispositifs/Dispositifs';
import Dispositif from './containers/Dispositif/Dispositif';
import ParkourOnBoard from './containers/ParkourOnBoard/ParkourOnBoard';
import ParkourPerso from './containers/ParkourPerso/ParkourPerso';
import Editeur from './containers/Editeur/Editeur';
import Avancement from './containers/Translation/Avancement/Avancement';
import Translation from './containers/Translation/Translation';
import RecordAudio from './containers/RecordAudio/RecordAudio';

const routes = [
  { path: '/', exact: true, name: 'home', component: DefaultLayout, restriction:[] },
  { path: '/homepage', name: 'Page d\'accueil', component: HomePage, restriction:[] },
  { path: '/forms', name: 'Formulaire', component: Forms, restriction:[] },
  { path: '/welcome_parcours', name: 'Parcours d\'accueil', component: WelcomeParcours, restriction:[] },
  { path: '/parcours', name: 'Parcours détaillé', component: Parcours, restriction:[] },

  { path: '/articles', name: 'Articles', component: Articles, restriction:[] },
  { path: '/article/:id', exact: true, name: 'Article', component: Article, restriction:[] },

  { path: '/dispositifs', name: 'Rechercher un dispositif', component: Dispositifs, restriction:[] },
  { path: '/dispositif/:id', exact: true, name: 'Dispositif', component: Dispositif, restriction:[] },
  { path: '/dispositif', exact: true, name: 'Dispositif', component: Dispositif, restriction:[] },

  { path: '/parcours-on-board', name: 'Parcours On Board', component: ParkourOnBoard, restriction:[] },
  { path: '/parcours-perso', name: 'Parcours perso', component: ParkourPerso, restriction:[] },

  { path: '/editeur', name: 'Editeur', component: Editeur, restriction:[] },
  { path: '/avancement/traductions/:id', exact: true, name: 'Avancement', component: Avancement, restriction:['ExpertTrad','Admin'] },
  { path: '/avancement/langue/:id', exact: true, name: 'Avancement', component: Avancement, restriction:['Trad','ExpertTrad','Admin'] },
  { path: '/avancement', name: 'Avancement', component: Avancement, restriction:['Trad','ExpertTrad','Admin'] },
  { path: '/traduction', exact: true, name: 'Traduction', component: Translation, restriction:['Trad','ExpertTrad','Admin'] },
  { path: '/traduction/validation/:id', exact: true, name: 'Traduction', component: Translation, restriction:['Trad','ExpertTrad','Admin'] },
  { path: '/traduction/:id', exact: true, name: 'Traduction', component: Translation, restriction:['Trad','ExpertTrad','Admin'] },

  { path: '/record-audio', exact: true, name: 'Enregistrement audio', component: RecordAudio, restriction:[] },

  { path: '/backend', exact:true, forceShow:true, name: 'Administration', component: Dashboard, restriction:['Admin'] },
  { path: '/backend/dashboard', name: 'Dashboard', component: Dashboard, restriction:['Admin'] },
  { path: '/backend/admin', name: 'Admin', component: Admin, restriction:['Admin'] },
  { path: '/backend/chat', name: 'Chat', component: Chat, restriction:['Admin'] },
  { path: '/backend/user-dashboard', name: 'UserDash', component: UserDash, restriction:['Trad','ExpertTrad','Admin'] },
  { path: '/backend/user-form', name: 'UserForm', component: UserForm, restriction:['Trad','ExpertTrad','Admin']},
  { path: '/backend/user-profile', name: 'UserProfile', component: UserProfile, restriction:['Trad','ExpertTrad','Admin'] },
  { path: '/backend/admin-langues', name: 'AdminLangues', component: AdminLangues, restriction:['Admin']},
];

export default routes;
