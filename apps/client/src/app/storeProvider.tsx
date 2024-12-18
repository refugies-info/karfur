"use client";

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "~/services/configureStore";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<any>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
