import React from 'react';
import { NavLink } from 'react-router-dom';

import myLogo from '../../assets/logo_diair.png';
import './Logo.css';

const logo = (props) => (
  <NavLink to="/">
    <div className="LogoWrapper" style={{height: props.height}}>
      <img src={myLogo} alt="logo" />
    </div>
  </NavLink>
);

export default logo;