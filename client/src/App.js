import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import track from 'react-tracking'; 
import { Spinner } from 'reactstrap';
import IdleTimer from 'react-idle-timer'
import './scss/fonts/circular-std/css/circular-std.css'

import Store from './Store/configureStore';
import { PrivateRoute } from './components/PrivateRoute';
import { socket } from './utils/API';
import {dispatch} from './tracking/dispatch';
import './i18n';

import 'react-notifications/src/notifications.scss';
import './App.scss';

const loading = () => <Spinner color="success" />;
const chargement = () => <div>Chargement</div>

// Containers
const Layout = Loadable({
  loader: () => import('./containers/Layout/Layout'),
  loading
});

// Pages
const Login = Loadable({
  loader: () => import('./containers/Login/Login'),
  loading
});


const Register = Loadable({
  loader: () => import('./containers/Register/Register'),
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

const LiveChat = Loadable({
  loader: () => import('./components/UI/LiveChat/LiveChat'),
  loading : chargement
});

class App extends Component {
  state = { data: {} }
  idleTimer = null;

  componentDidMount() {    
    socket.on('server:event', data => {
      console.log('évènement',data)
      this.setState({ data })
    })
    window.onbeforeunload = function() {
      this.props.tracking.trackEvent({ action: 'unmount', label: 'App' });
      return undefined;
    }.bind(this);
  }

  // _onAction = (e) => {
  //   // console.log('user did something', e)
  //   return;
  // }

  _onActive = () => this.props.tracking.trackEvent({ action: 'active', label: 'App', value: this.idleTimer.getRemainingTime() });

  _onIdle = () => this.props.tracking.trackEvent({ action: 'idle', label: 'App', value: this.idleTimer.getLastActiveTime() });

  sendMessage = (message,side) => {
    socket.emit(side + ':sendMessage', message)
  }
  socketFn={
    sendMessage: this.sendMessage
  }

  render() {
    return (
      <Provider store={Store}>
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
		      onActive={this._onActive}
          onIdle={this._onIdle}
          // onAction={this._onAction}
		      // debounce={250}
          timeout={1000 * 60 * 5} />
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

export default track({
  app: 'App',
}, { dispatch: dispatch, dispatchOnMount: true, process: (ownTrackingData) => ownTrackingData.page ? true : null })(
  App
)
