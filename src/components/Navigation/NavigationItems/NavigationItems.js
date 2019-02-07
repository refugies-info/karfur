import React from 'react';

import './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
    <ul className="NavigationItems">
        <NavigationItem link="/" active>Page d'accueil</NavigationItem>
        <NavigationItem link="/">Un formulaire</NavigationItem>
    </ul>
);

export default navigationItems;