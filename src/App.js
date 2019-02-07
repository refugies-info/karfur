import React, { Component } from 'react';

import Layout from './components/Layout/Layout'

import { HashRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import Store from './Store/configureStore';

import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/HomePage/HomePage'),
  loading
});

// Pages
const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});


const Register = Loadable({
  loader: () => import('./views/Pages/Register'),
  loading
});

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});

class App extends Component {
  render() {
    return (
      <Provider store={Store}>
        <Layout>
          <HashRouter>
              <Switch>
                <Route exact path="/login" name="Login Page" component={Login} />
                <Route exact path="/register" name="Register Page" component={Register} />
                <Route exact path="/404" name="Page 404" component={Page404} />
                <Route exact path="/500" name="Page 500" component={Page500} />
                <Route path="/" name="HomePage" component={DefaultLayout} />
              </Switch>
          </HashRouter>
        </Layout>
      </Provider>
    );
  }
}

export default App;
