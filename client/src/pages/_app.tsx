import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { Provider } from "react-redux";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Link from "next/link";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { PageOptions } from "types/interface";
import { initGA } from "lib/tracking";
import { isRoute } from "routes";

import { createNextDsfrIntegrationApi } from "@codegouvfr/react-dsfr/next-pagesdir";
import { wrapper } from "services/configureStore";
import { finishLoading, startLoading } from "services/LoadingStatus/loadingStatus.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { ConsentBannerAndConsentManagement, useConsent } from "hooks/useConsentContext";
import Layout from "components/Layout/Layout";
import "scss/index.scss";

// Only in TypeScript projects
declare module "@codegouvfr/react-dsfr/next-pagesdir" {
  interface RegisterLink {
    Link: typeof Link;
  }
}

const { withDsfr, dsfrDocumentApi } = createNextDsfrIntegrationApi({
  defaultColorScheme: "light",
  Link,
});

export { dsfrDocumentApi };

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  options: PageOptions;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, ...pageProps }: AppPropsWithLayout) => {
  const [history, setHistory] = useState<string[]>([]);
  const { store, props } = wrapper.useWrappedStore(pageProps);
  const defaultLayout = (page: ReactElement) => <Layout history={history}>{page}</Layout>;
  const getLayout = Component.getLayout ?? defaultLayout;
  const options: PageOptions = Component.options || {
    cookiesModule: true,
    supportModule: true,
  };
  const router = useRouter();

  const handleRouteChange = useCallback((url: string, { shallow }: { shallow: boolean }) => {
    setHistory((prevHistory) => {
      // add to history if url is new
      if (prevHistory[0] !== url) return [url, ...prevHistory];
      return prevHistory;
    });
  }, []);

  // ANALYTICS
  useEffect(() => {
    handleRouteChange(router.asPath, { shallow: false }); // initial route

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
    // Bug router: https://github.com/vercel/next.js/issues/18127#issuecomment-950907739
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load analytics without cookies if user has not clicked on cookie banner yet
  const { finalityConsent } = useConsent();
  useEffectOnce(() => {
    initGA(!!finalityConsent?.analytics);
  });

  // Loader
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isRoute(url, "/recherche") && !isRoute(window.location.pathname, "/recherche")) {
        store.dispatch(startLoading(LoadingStatusKey.NAVIGATING));
      }
    };
    const routeChanged = () => {
      store.dispatch(finishLoading(LoadingStatusKey.NAVIGATING));
    };
    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", routeChanged);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", routeChanged);
    };
  }, [store, router.events]);

  // CRISP
  useEffect(() => {
    const toggleDataPageAttribute = (url: string) => {
      const isContentPage = ["/demarche/", "/dispositif/", "/procedure/", "/program/"].some((path) =>
        url.includes(path),
      );
      if (isContentPage) document.body.setAttribute("data-page", "content");
      else document.body.setAttribute("data-page", "");
    };

    toggleDataPageAttribute(document.location.href);
    router.events.on("routeChangeComplete", toggleDataPageAttribute);
    return () => {
      router.events.off("routeChangeComplete", toggleDataPageAttribute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {options.cookiesModule && <ConsentBannerAndConsentManagement />}
      <Provider store={store}>{getLayout(<Component history={history} {...props.pageProps} />)}</Provider>

      {options.supportModule && (
        <Script
          id="crisp-widget"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
            window.$crisp=[["safe", true]];
            window.CRISP_WEBSITE_ID="74e04b98-ef6b-4cb0-9daf-f8a2b643e121";
            (function(){
              const d = document;
              const s = d.createElement("script");
              s.src = "https://client.crisp.chat/l.js";
              s.async = 1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();`,
          }}
        />
      )}
    </div>
  );
};

export default withDsfr(appWithTranslation(App));
