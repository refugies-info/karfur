import DefaultLayout from './containers/Layout/Layout';

import HomePage from './containers/HomePage/HomePage';
import Forms from './views/Base/Forms';
import WelcomeParcours from './views/Base/WelcomeParcours';
import Parcours from './views/Base/Parcours';
import Dashboard from './containers/Backend/Dashboard/Dashboard';
import UserDash from './containers/Backend/UserDash/UserDash';
import Chat from './containers/Backend/Chat/Chat';
import Articles from './containers/Articles/Articles';
import Article from './containers/Article/Article';
import Editeur from './containers/Editeur/Editeur';
import Avancement from './containers/Translation/Avancement/Avancement';
import Translation from './containers/Translation/Translation';

const routes = [
  { path: '/', exact: true, name: 'home', component: DefaultLayout, restriction:null },
  { path: '/homepage', name: 'Page d\'accueil', component: HomePage, restriction:null },
  { path: '/base/forms', name: 'Formulaire', component: Forms, restriction:null },
  { path: '/base/welcome_parcours', name: 'Parcours d\'accueil', component: WelcomeParcours, restriction:null },
  { path: '/base/parcours', name: 'Parcours détaillé', component: Parcours, restriction:null },

  { path: '/articles', name: 'Articles', component: Articles, restriction:null },
  { path: '/article/:id', exact: true, name: 'Article', component: Article, restriction:null },

  { path: '/editeur', name: 'Editeur', component: Editeur, restriction:null },
  { path: '/avancement', name: 'Avancement', component: Avancement, restriction:null },
  { path: '/traduction', name: 'Traduction', component: Translation, restriction:null },

  { path: '/backend', exact: true, name: 'Administration', component: Dashboard, restriction:'admin' },
  { path: '/backend/dashboard', name: 'Dashboard', component: Dashboard, restriction:'admin' },
  { path: '/backend/chat', name: 'Chat', component: Chat, restriction:'admin' },
  { path: '/backend/user-dashboard', name: 'UserDash', component: UserDash, restriction:'translator' },
];

export default routes;
