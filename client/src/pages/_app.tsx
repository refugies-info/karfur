import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { appWithTranslation } from "next-i18next";
import type { NextPage } from "next";
import { wrapper } from "services/configureStore";
import Layout from "components/Layout/Layout";
import isInBrowser from "lib/isInBrowser";
import { useRouter } from "next/router";
import { initGA, PageView } from "lib/tracking";
import { PageOptions } from "types/interface";
import "scss/index.scss";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
  options: PageOptions
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [history, setHistory] = useState<string[]>([]);
  const defaultLayout = (page: ReactElement) => <Layout history={history}>{page}</Layout>;
  const getLayout = Component.getLayout ?? defaultLayout;
  const options: PageOptions = Component.options || {
    cookiesModule: true,
    supportModule: true
  }
  const router = useRouter();

  if (isInBrowser() && options.cookiesModule) {
    // AXEPTIO
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
      {options.cookiesModule &&
        <Script src="//static.axept.io/sdk.js" strategy="afterInteractive" />
      }
      {options.supportModule &&
        <Script
          id="crisp-widget"
          strategy="afterInteractive"
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
      }

      {getLayout(<Component history={history} {...pageProps} />)}
    </>
  )
}

export default wrapper.withRedux(appWithTranslation(App));
