import React, { ReactElement, ReactNode } from "react";
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

import { store } from "../services/configureStore";
import Layout from "components/Layout/Layout";

import "App.scss";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const defaultLayout = (page: ReactElement) => <Layout>{page}</Layout>;
  const getLayout = Component.getLayout ?? defaultLayout;

  return (
    <Provider store={store}>
      {getLayout(<Component {...pageProps} />)}
    </Provider>
  )
}

export default App
