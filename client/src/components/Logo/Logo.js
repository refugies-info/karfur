import React from 'react';
import { NavLink } from 'react-router-dom';

import './Logo.scss';

const logo = (props) => (
  <NavLink to="/" className="logo mr-10">
    <span>Réfugiés.info</span>
    {!props.reduced && <sup className="beta-tag">beta</sup>}
  </NavLink>
);

export default logo;