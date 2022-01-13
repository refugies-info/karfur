import React from "react";

import NavigationItem from "./NavigationItem/NavigationItem";
// import routes from "../../../routes";

import "./NavigationItems.module.scss";

const navigationItems = () => {
  let dispRoutes = [].filter((x) => x.path === "/dispositifs");
  return (
    <ul className="NavigationItems">
      {dispRoutes.map((route, idx) => {
        return (
          <NavigationItem key={idx} link={route.path} active={idx === 1}>
            {route.name}
          </NavigationItem>
          // (!route.exact || route.forceShow) && (route.path.match(new RegExp("/", "g")) || []).length <=1 &&
        );
      })}
    </ul>
  );
};

export default navigationItems;
