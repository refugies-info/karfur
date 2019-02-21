import React from 'react';

import myLogo from '../../assets/logo_diair.png';
import './Logo.css';

const logo = (props) => (
    <div className="LogoWrapper" style={{height: props.height}}>
        <img src={myLogo} alt="logo" />
    </div>
);

export default logo;