import React from 'react';

import './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';
import routes from '../../../routes'

const navigationItems = () => (
    <ul className="NavigationItems">
        {routes.map((route, idx) => {
            return (
                idx>0 && <NavigationItem link={route.path} active={idx===1}>{route.name}</NavigationItem>
            )
        })}
    </ul>
);

export default navigationItems;