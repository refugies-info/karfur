import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import type { NextPage } from "next";
import { wrapper } from "services/configureStore";
import Layout from "components/Layout/Layout";
import isInBrowser from "lib/isInBrowser";
import "scss/index.scss";
import { useRouter } from "next/router";
import { initGA, PageView } from "lib/tracking";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const defaultLayout = (page: ReactElement) => <Layout>{page}</Layout>;
  const getLayout = Component.getLayout ?? defaultLayout;
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  if (isInBrowser()) {
    // CRISP
    window.$crisp = [["safe", true]];
    window.CRISP_WEBSITE_ID = "74e04b98-ef6b-4cb0-9daf-f8a2b643e121";

    // AXEPTION
    window.axeptioSettings = {
      clientId: process.env.NEXT_PUBLIC_REACT_APP_AXEPTIO_CLIENTID,
    };
  }

  const handleRouteChange = useCallback((
    url: string,
    { shallow }: { shallow: boolean }
  ) => {
    if (!shallow) PageView();

    setHistory(prevHistory => { // add to history if url is new
      if (prevHistory[0] !== url) return [url, ...prevHistory];
      return prevHistory;
    });
  }, []);

  // ANALYTICS
  useEffect(() => {
    initGA();
    handleRouteChange(router.asPath, { shallow: false }); // initial route

    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  // Bug router: https://github.com/vercel/next.js/issues/18127#issuecomment-950907739
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Script src="https://client.crisp.chat/l.js" strategy="lazyOnload" />
      <Script src="//static.axept.io/sdk.js" strategy="lazyOnload" />

      {getLayout(<Component history={history} {...pageProps} />)}
    </>
  )
}

export default wrapper.withRedux(appWithTranslation(App));
