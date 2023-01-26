import React, { useEffect, useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import UnauthorizedAccess from "components/Navigation/UnauthorizedAccess/UnauthorizedAccess";
import { userSelector } from "services/User/user.selectors";
import { fetchUserActionCreator } from "services/User/user.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { backendRoutes, BackendRouteType } from "containers/Backend/routes";
import { getPath } from "routes";
import isInBrowser from "lib/isInBrowser";
import SEO from "components/Seo";
import API from "utils/API";
import styles from "scss/pages/backend.module.scss";
import { useRouter } from "next/router";
import history from "utils/backendHistory";
import { createBrowserHistory } from "history";
import useRouterLocale from "hooks/useRouterLocale";

const Redirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(getPath("/login", router.locale));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

const Backend = () => {
  const user = useSelector(userSelector);
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const dispatch = useDispatch();
  const router = useRouter();
  const routerLocale = useRouterLocale();

  // fix for: https://github.com/vercel/next.js/discussions/17443#discussioncomment-637879
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    history?.push(routerLocale + router.asPath);
    return () => setMounted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user && !isLoading && API.isAuth()) dispatch(fetchUserActionCreator());
  }, [user, isLoading, dispatch]);

  const isAuthorized = (route: BackendRouteType) => {
    if ((route.restriction || []).length === 0) {
      // No restriction: OK
      return true;
    }

    // Restriction and role: CHECK
    const roles = (user?.user && user.user.roles) || [];
    const hasAuthorizedRole = roles.filter((x: any) => route.restriction.includes(x.nom)).length > 0;
    const hasRouteRestrictionHasStructure = route.restriction.includes("hasStructure");
    return hasAuthorizedRole || (hasRouteRestrictionHasStructure && user.hasStructure);
  };

  return (
    <>
      <SEO title="Administration" />
      {isLoading ? (
        <div className={styles.spinner_container}>
          <Spinner color="success" />
        </div>
      ) : (
        isInBrowser() &&
        mounted &&
        (user ? (
          <Router history={history || createBrowserHistory()}>
            <Switch>
              {backendRoutes.map((route, idx) =>
                route.component ? (
                  <Route
                    key={idx}
                    path={routerLocale + route.path}
                    exact={route.exact}
                    render={() =>
                      isAuthorized(route) ? <route.component title={route.name} /> : <UnauthorizedAccess />
                    }
                  />
                ) : null
              )}
            </Switch>
          </Router>
        ) : (
          <Redirect />
        ))
      )}
    </>
  );
};

export const getServerSideProps = defaultStaticProps;

export default Backend;
