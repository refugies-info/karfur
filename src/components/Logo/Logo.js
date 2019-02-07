import React from 'react';

import burgerLogo from '../../assets/logo_diair.png';
import './Logo.css';

const logo = (props) => (
    <div className="LogoWrapper" style={{height: props.height}}>
        <img src={burgerLogo} alt="MyBurger" />
    </div>
);

export default logo;