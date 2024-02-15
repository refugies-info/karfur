import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { RoleName } from "@refugies-info/api-types";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { setLoginRedirect } from "lib/loginRedirect";
import UnauthorizedAccess from "components/Navigation/UnauthorizedAccess/UnauthorizedAccess";
import { userSelector } from "services/User/user.selectors";
import { fetchUserActionCreator } from "services/User/user.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { backendRoutes, BackendRouteType } from "components/Backend/screens/routes";
import { getPath } from "routes";
import { useAuth } from "hooks";
import isInBrowser from "lib/isInBrowser";
import SEO from "components/Seo";
import styles from "scss/pages/backend.module.scss";
import { useRouter } from "next/router";
import history from "utils/backendHistory";
import { createBrowserHistory } from "history";
import useRouterLocale from "hooks/useRouterLocale";
import API from "utils/API";

const Redirect = () => {
  const router = useRouter();

  useEffect(() => {
    setLoginRedirect();
    router.replace(getPath("/auth", "fr"));
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
  const { isAuth } = useAuth();
  const userLoaded = useMemo(() => !!user.user, [user]);

  // fix for: https://github.com/vercel/next.js/discussions/17443#discussioncomment-637879
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    history?.push(routerLocale + router.asPath);
    return () => setMounted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userLoaded && !isLoading && isAuth) dispatch(fetchUserActionCreator());
  }, [userLoaded, isLoading, isAuth, dispatch]);

  const isAuthorized = useCallback(
    (route: BackendRouteType) => {
      if ((route.restriction || []).length === 0) {
        // No restriction: OK
        return true;
      }

      // Restriction and role: CHECK
      const roles = user.user?.roles || [];
      const hasAuthorizedRole = roles.filter((x: any) => route.restriction.includes(x.nom)).length > 0;
      const hasRouteRestrictionHasStructure = route.restriction.includes(RoleName.STRUCTURE);
      return hasAuthorizedRole || (hasRouteRestrictionHasStructure && user.hasStructure);
    },
    [user],
  );

  const state = useMemo(() => {
    if (isLoading && !userLoaded) return "loading"; // no spinner if user is being re-fetched
    if (!API.isAuth()) return "anonymous";
    if (isInBrowser() && mounted && userLoaded) return "ready";
    return null;
  }, [isLoading, userLoaded, mounted]);

  return (
    <>
      <SEO title="Administration" />
      {state === "loading" && (
        <div className={styles.spinner_container}>
          <Spinner color="success" />
        </div>
      )}
      {state === "anonymous" && <Redirect />}
      {state === "ready" && (
        <Router history={history || createBrowserHistory()}>
          <Switch>
            {backendRoutes.map((route, idx) =>
              route.component ? (
                <Route
                  key={idx}
                  path={routerLocale + route.path}
                  exact={route.exact}
                  render={() => (isAuthorized(route) ? <route.component title={route.name} /> : <UnauthorizedAccess />)}
                />
              ) : null,
            )}
          </Switch>
        </Router>
      )}
    </>
  );
};

export const getServerSideProps = defaultStaticProps;

export default Backend;
