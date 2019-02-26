import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';

import Store from './Store/configureStore';
import { PrivateRoute } from './components/PrivateRoute';
import LiveChat from './components/UI/LiveChat/LiveChat';
import { socket } from './utils/API';

import 'react-notifications/src/notifications.scss';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const Layout = Loadable({
  loader: () => import('./components/Layout/Layout'),
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
  state = { data: {} }

  componentDidMount() {    
    socket.on('server:event', data => {
      console.log('évènement',data)
      this.setState({ data })
    })
  }
  sendMessage = (message,side) => {
    socket.emit(side + ':sendMessage', message)
  }
  socketFn={
    sendMessage: this.sendMessage
  }

  render() {
    return (
      <Provider store={Store}>
        <BrowserRouter>
            <Switch>
              <Route exact path="/login" name="Login Page" component={Login} />
              <Route exact path="/register" name="Register Page" component={Register} />
              <Route exact path="/404" name="Page 404" component={Page404} />
              <Route exact path="/500" name="Page 500" component={Page500} />
              <PrivateRoute 
                  path='/' 
                  component={Layout} 
                  socket = { socket } 
                  socketFn = { this.socketFn }/>
            </Switch>
        </BrowserRouter>
        <LiveChat socket = { socket } 
                  socketFn = { this.socketFn } /> 
      </Provider>
    );
  }
}

export default App;
