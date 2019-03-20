import React from 'react';

import './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';
import routes from '../../../routes'

const navigationItems = () => (
    <ul className="NavigationItems">
        {routes.map((route, idx) => {
            return (
                (!route.exact || route.forceShow) && (route.path.match(new RegExp("/", "g")) || []).length <=1 && 
                  <NavigationItem key={idx} link={route.path} active={idx===1}>{route.name}</NavigationItem>
                //!route.restriction && 
            )
        })}
    </ul>
);

export default navigationItems;