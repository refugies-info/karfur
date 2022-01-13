import React from "react";
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'

import { store } from "../services/configureStore";
import Layout from "components/Layout/Layout";

import "App.scss";
import "components/Layout/Layout.scss";

const App = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </Provider>
)

export default App
