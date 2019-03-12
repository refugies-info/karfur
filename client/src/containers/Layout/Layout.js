import React, { Component }  from 'react';
import i18n from '../../i18n';
import { withTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import DirectionProvider, { DIRECTIONS } from 'react-with-direction/dist/DirectionProvider';
import track from 'react-tracking';

import Aux from '../../hoc/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Footer from '../../components/Navigation/Footer/Footer';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import OnBoardingTraducteurModal from '../../components/Modals/OnBoardingTradModal/OnBoardingTraducteurModal'

import './Layout.css';
import routes from '../../routes';

class Layout extends Component {
  state = {
    showSideDrawer: false,
    traducteur:false,
    showOnBoardingTraducteurModal:false
  }
  
  sideDrawerClosedHandler = () => {
      this.setState( { showSideDrawer: false } );
  }

  sideDrawerToggleHandler = () => {
      this.setState( ( prevState ) => {
          return { showSideDrawer: !prevState.showSideDrawer };
      } );
  }

  devenirTraducteur = () => {
    this.setState({showOnBoardingTraducteurModal:true})
  }

  closeOnBoardingTraducteurModal = () => {
    this.setState({showOnBoardingTraducteurModal:false})
  }
  
  render() {
    return (
      <DirectionProvider 
        direction={i18n.language==="ar" ? DIRECTIONS.RTL : DIRECTIONS.LTR}>
        <Aux>
          <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
          <SideDrawer
              open={this.state.showSideDrawer}
              closed={this.sideDrawerClosedHandler} />
              <main className="Content">
                  {this.props.children}
                  <> 
                      <Switch>
                          {routes.map((route, idx) => {
                              return route.component ? (
                              <Route
                                  key={idx}
                                  path={route.path}
                                  exact={route.exact}
                                  name={route.name}
                                  render={props => (
                                  <route.component 
                                      socket = { this.props.socket } 
                                      socketFn = { this.props.socketFn }
                                      {...props} />
                                  )} />
                              ) : (null);
                          })}
                          <Redirect from="/" to="/homepage" />
                      </Switch>
                  </>
              </main>
          <Footer devenirTraducteur={this.devenirTraducteur} />
          <OnBoardingTraducteurModal 
            show={this.state.showOnBoardingTraducteurModal}
            closeOnBoardingTraducteurModal={this.closeOnBoardingTraducteurModal}
            />
        </Aux>
      </DirectionProvider>
    )
  }
}

export default track({
        layout: 'Layout',
    }, { dispatchOnMount: true })(
      withTranslation()(Layout)
    );