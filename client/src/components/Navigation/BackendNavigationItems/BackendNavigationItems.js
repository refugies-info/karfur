import React from "react";

import BackendNavigationItem from "./BackendNavigationItem/BackendNavigationItem";
import routes from "../../../routes";

import "./BackendNavigationItems.css";

const backendNavigationItems = (props) => (
  <ul className="BackendNavigationItems">
    {routes.map(
      (route, idx) =>
        route.path.includes("backend") &&
        route.path.includes("admin") && (
          <BackendNavigationItem
            key={idx}
            link={route.path}
            active={idx === 1}
            {...props}
          >
            {route.name}
          </BackendNavigationItem>
        )
    )}
  </ul>
);

export default backendNavigationItems;
