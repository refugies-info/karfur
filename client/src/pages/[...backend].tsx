import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import routes from "routes";
import isInBrowser from "lib/isInBrowser";
import SEO from "components/Seo";
import { defaultStaticProps } from "lib/getDefaultStaticProps";

const Backend = () =>
  <>
    <SEO title="Administration" />
    {isInBrowser() && (
      <Router>
        <Switch>
          {routes.map((route, idx) =>
            route.component ? (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={() => <route.component />}
              />
            ) : null
          )}
        </Switch>
      </Router>
    )}
  </>

export const getServerSideProps = defaultStaticProps;

export default Backend;
