"use client";

import React from "react";
import { Provider } from "react-redux";
import { wrapper } from "~/services/configureStore";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const { store } = wrapper.useWrappedStore({});
  return <Provider store={store}>{children}</Provider>;
}
