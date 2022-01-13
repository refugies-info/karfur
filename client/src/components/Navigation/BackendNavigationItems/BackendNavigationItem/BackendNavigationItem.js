import React from "react";
// import { NavLink } from "react-router-dom";

import "./BackendNavigationItem.module.scss";

const backendNavigationItem = (props) => (
  <NavLink
    exact
    to={props.link}
    onClick={props.closed}
    className="backend-navgation-wrapper"
  >
    <li className="BackendNavigationItem">{props.children}</li>
  </NavLink>
);

export default backendNavigationItem;
