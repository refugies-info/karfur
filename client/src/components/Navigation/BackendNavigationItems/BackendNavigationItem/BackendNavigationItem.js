import React from 'react';
import { NavLink } from 'react-router-dom';

import './BackendNavigationItem.css';

const backendNavigationItem = ( props ) => (
    <li className="BackendNavigationItem">
      <NavLink
        to={props.link} 
        onClick={props.closed}
        exact>
        {props.children}
      </NavLink>
    </li>
);

export default backendNavigationItem;