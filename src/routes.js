import React from 'react';
import DefaultLayout from './components/Layout/Layout';

const Forms = React.lazy(() => import('./views/Base/Forms'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/base/forms', name: 'Forms', component: Forms }
];

export default routes;
