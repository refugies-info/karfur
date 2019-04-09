import React from 'react';

import './BackendNavigationItems.css';
import BackendNavigationItem from './BackendNavigationItem/BackendNavigationItem';
import routes from '../../../routes'

const backendNavigationItems = (props) => (
    <ul className="BackendNavigationItems">
        {routes.map((route, idx) => {
            return (
                !route.exact && route.restriction.includes("Admin") && 
                  <BackendNavigationItem key={idx} link={route.path} active={idx===1} {...props}>{route.name}</BackendNavigationItem>
            )
        })}
    </ul>
);

export default backendNavigationItems;