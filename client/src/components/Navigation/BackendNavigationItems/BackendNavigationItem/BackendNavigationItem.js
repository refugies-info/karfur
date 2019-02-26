import React from 'react';

import './BackendNavigationItem.css';

const backendNavigationItem = ( props ) => (
    <li className="BackendNavigationItem">
        <a 
            href={props.link} 
            className={props.active ? "active" : null}>{props.children}</a>
    </li>
);

export default backendNavigationItem;