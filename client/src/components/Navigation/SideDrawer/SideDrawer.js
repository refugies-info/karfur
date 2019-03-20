import React from 'react';

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import BackendNavigationItems from '../BackendNavigationItems/BackendNavigationItems';
import './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Aux';
import {withRouter} from 'react-router-dom';

const sideDrawer = ( props ) => {
    let attachedClasses = ["SideDrawer", "Close", "HideSideDrawer"];
    if (props.open) {
        attachedClasses = ["SideDrawer", "Open", "HideSideDrawer"];
    }
    const path = props.location.pathname;
    if(path.includes("/backend")){
        attachedClasses.splice(2);
    }
    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.closed}/>
            <div className={attachedClasses.join(' ')}>
                <div className="Logo">
                    <Logo />
                </div>
                <nav>
                    {!path.includes("/backend") && <NavigationItems />}
                    {path.includes("/backend") && <BackendNavigationItems />}
                </nav>
            </div>
        </Aux>
    );
};

export default withRouter(sideDrawer);