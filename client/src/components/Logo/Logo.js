import React from 'react';
import { NavLink } from 'react-router-dom';

import { logo_header } from '../../assets/figma';

import './Logo.scss';

const logo = (props) => (
  <NavLink to="/" className="logo mr-10">
    <img src={logo_header} className="logo-img" />
  </NavLink>
);

export default logo;