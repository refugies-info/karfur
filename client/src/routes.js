import DefaultLayout from './components/Layout/Layout';

import HomePage from './containers/HomePage/HomePage';
import Forms from './views/Base/Forms';
import WelcomeParcours from './views/Base/WelcomeParcours';
import Parcours from './views/Base/Parcours';
import Dashboard from './views/Backend/Dashboard/Dashboard';
import Chat from './views/Backend/Chat/Chat';

const routes = [
  { path: '/', exact: true, name: 'home', component: DefaultLayout, restriction:null },
  { path: '/homepage', name: 'Page d\'accueil', component: HomePage, restriction:null },
  { path: '/base/forms', name: 'Formulaire', component: Forms, restriction:null },
  { path: '/base/welcome_parcours', name: 'Parcours d\'accueil', component: WelcomeParcours, restriction:null },
  { path: '/base/parcours', name: 'Parcours détaillé', component: Parcours, restriction:null },

  { path: '/admin', exact: true, name: 'Administration', component: Dashboard, restriction:'admin' },
  { path: '/admin/dashboard', name: 'Dashboard', component: Dashboard, restriction:'admin' },
  { path: '/admin/chat', name: 'Chat', component: Chat, restriction:'admin' }
];

export default routes;
