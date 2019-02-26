import React from 'react';

import './DrawerToggle.css';

const drawerToggle = (props) => (
    <div className={props.forceShow ? "DrawerToggle" : "DrawerToggle HideOnDesktop"} onClick={props.clicked}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default drawerToggle;