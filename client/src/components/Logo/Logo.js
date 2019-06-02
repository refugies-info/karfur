import React from 'react';
import { NavLink } from 'react-router-dom';

import './Logo.scss';

const logo = (props) => (
  <NavLink to="/" className="logo">
    Agir
    <sup className="beta-tag">beta</sup>
  </NavLink>
);

export default logo;