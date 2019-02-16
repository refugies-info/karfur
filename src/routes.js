import DefaultLayout from './components/Layout/Layout';

import HomePage from './containers/HomePage/HomePage';
import Forms from './views/Base/Forms';
import WelcomeParcours from './views/Base/WelcomeParcours';

const routes = [
  { path: '/', exact: true, name: 'home', component: DefaultLayout },
  { path: '/homepage', name: 'Page d\'accueil', component: HomePage },
  { path: '/base/forms', name: 'Formulaire', component: Forms },
  { path: '/base/welcome_parcours', name: 'Parcours d\'accueil', component: WelcomeParcours }
];

export default routes;
