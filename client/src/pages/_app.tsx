import React, { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import Script from "next/script";
import type { NextPage } from "next";
import { wrapper } from "services/configureStore";
import Layout from "components/Layout/Layout";
import isInBrowser from "lib/isInBrowser";
import "scss/index.scss";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const defaultLayout = (page: ReactElement) => <Layout>{page}</Layout>;
  const getLayout = Component.getLayout ?? defaultLayout;

  if (isInBrowser()) {
    // CRISP
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "74e04b98-ef6b-4cb0-9daf-f8a2b643e121";

    // AXEPTION
    window.axeptioSettings = {
      clientId: process.env.NEXT_PUBLIC_REACT_APP_AXEPTIO_CLIENTID,
    };
  }

  return (
    <>
      <Script src="https://client.crisp.chat/l.js" strategy="lazyOnload" />
      <Script src="//static.axept.io/sdk.js" strategy="lazyOnload" />

      {getLayout(<Component {...pageProps} />)}
    </>
  )
}

export default wrapper.withRedux(App);
