import React, { Component }  from 'react';

import Aux from '../../hoc/Aux';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import Footer from '../Navigation/Footer/Footer';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

import './Layout.css';

import i18n from '../../i18n';
import { withNamespaces } from 'react-i18next';

import routes from '../../routes';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import DirectionProvider, { DIRECTIONS } from 'react-with-direction/dist/DirectionProvider';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }
    
    render() {
        return (
            <DirectionProvider direction={i18n.language==="ar" ? DIRECTIONS.RTL : DIRECTIONS.LTR}>
                <Aux>
                    <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
                    <SideDrawer
                        open={this.state.showSideDrawer}
                        closed={this.sideDrawerClosedHandler} />
                    <main className="Content">
                        {this.props.children}
                        <Container fluid>
                            <Switch>
                                {routes.map((route, idx) => {
                                    return route.component ? (
                                    <Route
                                        key={idx}
                                        path={route.path}
                                        exact={route.exact}
                                        name={route.name}
                                        render={props => (
                                        <route.component {...props} />
                                        )} />
                                    ) : (null);
                                })}
                                <Redirect from="/" to="/homepage" />
                            </Switch>
                        </Container>
                    </main>
                    <Footer />
                </Aux>
            </DirectionProvider>
        )
    }
}

export default withNamespaces()(Layout);