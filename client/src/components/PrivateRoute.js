import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import API from "../utils/API";
import UnauthorizedAccess from "./Navigation/UnauthorizedAccess/UnauthorizedAccess";
import { fetch_user } from "../services/User/user.actions";

const PrivateRoute = ({ component: Component, socket, socketFn, ...rest }) => {
  const { user, fetch_user } = rest;
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
              fetch_user();
            }
            const roles = (user && user.roles) || [];
            const isAuthorized =
              roles.filter((x) => route.restriction.includes(x.nom)).length > 0;
            if (isAuthorized) {
              return (
                <Component {...props} socket={socket} socketFn={socketFn} />
              );
            } else {
              return <UnauthorizedAccess />;
            }
          } else {
            return <Component {...props} socket={socket} socketFn={socketFn} />;
          }
        } else {
          return <Component {...props} socket={socket} socketFn={socketFn} />;
        }
      }}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = { fetch_user };

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
