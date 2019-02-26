import React from 'react';
import { Button } from 'reactstrap';
import {withRouter} from 'react-router-dom';

import './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import API from '../../../utils/API';

export class Toolbar extends React.Component {
    constructor(props){
        super(props);
        this.disconnect.bind(this);
    }
    disconnect = event => {
        API.logout();
        window.location = "/";
    }

    render() {
        const path = this.props.location.pathname;
        let afficher_burger=false;
        if(path.includes("/admin")){
            afficher_burger=true;
        }
        return(
            <header className="Toolbar">
                <DrawerToggle 
                    forceShow={afficher_burger}
                    clicked={this.props.drawerToggleClicked} />
                <div className="Logo">
                    <Logo />
                </div>
                <nav className="DesktopOnly">
                    <NavigationItems />
                </nav>
                {API.isAuth() ? 
                    <Button onClick={this.disconnect}
                            type="submit">
                        Se déconnecter
                    </Button>
                    :
                    <a 
                        href="/login"
                        className="makeItRed">Se connecter</a>
                }
            </header>
        )
    }
};

export default withRouter(Toolbar);