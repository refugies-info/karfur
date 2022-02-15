import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import API from "../utils/API";
import UnauthorizedAccess from "./Navigation/UnauthorizedAccess/UnauthorizedAccess";
import { fetchUserActionCreator } from "../services/User/user.actions";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, fetchUser } = rest;

/*   const updateLastConnexion = () => {
    if (
      API.isAuth &&
      user &&
      user.last_connected &&
      !(
        new Date(user.last_connected).getDate() === new Date().getDate() &&
        new Date(user.last_connected).getDay() === new Date().getDay() &&
        new Date(user.last_connected).getFullYear() === new Date().getFullYear()
      )
    ) {
      user.last_connected = new Date();
      API.set_user_info(user);
    }
  };
  updateLastConnexion(); */

  const isAuthorized = (user, route) => {
      if (API.isAuth() === false && (route.restriction || []).length > 0) {
        return <Redirect to={{ pathname: "/login", state: { redirectTo: path } }} />
      } else if (API.isAuth() && (route.restriction || []).length > 0) {
        const roles = (user && user.roles) || [];
        const hasAuthorizedRole = roles.filter((x) => route.restriction.includes(x.nom)).length > 0;
        const hasRouteRestrictionHasStructure = route.restriction.includes("hasStructure");
        const hasUserStructure = (user?.structures || []).length > 0 ? true : false;
        if (hasAuthorizedRole || (hasRouteRestrictionHasStructure && hasUserStructure )) {
          return true
        }
        return false;
      }
      return true;
    }
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        var path = props.location.pathname;
        if (path !== "/" && path !== "/homepage") {
          var id =
            path.split("/").length -
              1 -
              (path.indexOf("http://") === -1 ? 0 : 2) >
            1
              ? path.substring(path.lastIndexOf("/") + 1)
              : "";
          const routes = require("../routes").default;
          const route =
            routes.find((x) => x.path.replace(":id", id) === path) || {};
          if (
            API.isAuth() === false &&
            route.restriction &&
            route.restriction.length > 0
          ) {
            return (
              <Redirect
                to={{ pathname: "/login", state: { redirectTo: path } }}
              />
            );
          } else if (
            API.isAuth() &&
            route.restriction &&
            route.restriction.length > 0
          ) {
            if (!user || !user.roles) {
              fetchUser();
            }
            const roles = (user && user.roles) || [];
            const isAuthorized =
              roles.filter((x) => route.restriction.includes(x.nom)).length > 0;
            const hasRouteRestrictionHasStructure =
              route.restriction.includes("hasStructure");

            const hasUserStructure =
              user && user.structures && user.structures.length > 0
                ? true
                : false;
            if (
              isAuthorized ||
              (hasUserStructure && hasRouteRestrictionHasStructure)
            ) {
              return (
                <Component {...props} />
              );
            }
            return <UnauthorizedAccess />;
          }
          return <Component {...props} />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = { fetchUser: fetchUserActionCreator };

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
