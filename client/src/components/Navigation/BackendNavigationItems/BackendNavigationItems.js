import React from 'react';

import './BackendNavigationItems.css';
import BackendNavigationItem from './BackendNavigationItem/BackendNavigationItem';
import routes from '../../../routes'

const backendNavigationItems = () => (
    <ul className="BackendNavigationItems">
        {routes.map((route, idx) => {
            return (
                !route.exact && route.restriction.includes("Admin") && <BackendNavigationItem key={idx} link={route.path} active={idx===1}>{route.name}</BackendNavigationItem>
            )
        })}
    </ul>
);

export default backendNavigationItems;