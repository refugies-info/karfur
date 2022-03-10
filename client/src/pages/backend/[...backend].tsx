import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import { Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import UnauthorizedAccess from "components/Navigation/UnauthorizedAccess/UnauthorizedAccess";
import { userDetailsSelector } from "services/User/user.selectors";
import { fetchUserActionCreator } from "services/User/user.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import routes, { RouteType } from "routes";
import isInBrowser from "lib/isInBrowser";
import SEO from "components/Seo";
import API from "utils/API";
import styles from "scss/pages/backend.module.scss";
import { useRouter } from "next/router";

const Backend = () => {
  const user = useSelector(userDetailsSelector);
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const dispatch = useDispatch();
  const router = useRouter();

  // fix for: https://github.com/vercel/next.js/discussions/17443#discussioncomment-637879
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user && !isLoading) dispatch(fetchUserActionCreator());
  }, [user, isLoading, dispatch]);

  const isAuthorized = (route: RouteType) => {
    if ((route.restriction || []).length === 0) { // No restriction: OK
      return true;
    }

    if (!API.isAuth()) { // Restriction and no auth: NOK
      router.push("/login");
      return false;
    }

    // Restriction and role: CHECK
    const roles = (user && user.roles) || [];
    const hasAuthorizedRole = roles.filter((x: any) => route.restriction.includes(x.nom)).length > 0;
    const hasRouteRestrictionHasStructure = route.restriction.includes("hasStructure");
    const hasUserStructure = (user?.structures || []).length > 0 ? true : false;
    return (
      hasAuthorizedRole || (hasRouteRestrictionHasStructure && hasUserStructure)
    );
  };

  const locale = router.locale && router.locale !== "fr" ? "/" + router.locale : "";

  return (
    <>
      <SEO title="Administration" />
      {isLoading ? (
        <div className={styles.spinner_container}>
          <Spinner color="success" />
        </div>
      ) : (
        isInBrowser() && mounted && (
          <Router>
            <Switch>
              {routes.map((route, idx) =>
                route.component ? (
                  <Route
                    key={idx}
                    path={locale + route.path}
                    exact={route.exact}
                    name={route.name}
                    render={() =>
                      isAuthorized(route) ? (
                        <route.component />
                      ) : (
                        <UnauthorizedAccess />
                      )
                    }
                  />
                ) : null
              )}
            </Switch>
          </Router>
        )
      )}
    </>
  );
};

export const getServerSideProps = defaultStaticProps;

export default Backend;
