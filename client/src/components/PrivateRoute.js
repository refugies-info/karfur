/* eslint-disable no-console */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Spinner } from "reactstrap";

import API from "../utils/API";
import UnauthorizedAccess from "./Navigation/UnauthorizedAccess/UnauthorizedAccess";
import { fetchUserActionCreator } from "../services/User/user.actions";
const loading = () => (
  <div className="spinner-container">
    test
    <Spinner color="red" className="waiting-spinner" />
  </div>
);

const PrivateRoute = ({ component: Component, socket, socketFn, ...rest }) => {
  const { user, fetchUser } = rest;
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
            if (isAuthorized) {
              return (
                <React.Suspense fallback={loading()}>
                  <Component {...props} socket={socket} socketFn={socketFn} />
                </React.Suspense>
              );
            }
            return <UnauthorizedAccess />;
          }
          return (
            <React.Suspense fallback={loading()}>
              <Component {...props} socket={socket} socketFn={socketFn} />;
            </React.Suspense>
          );
        }

        return (
          <React.Suspense fallback={loading()}>
            <Component {...props} socket={socket} socketFn={socketFn} />;
          </React.Suspense>
        );
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
