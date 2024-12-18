import { createWrapper } from "next-redux-wrapper";
import { Action, applyMiddleware, createStore, Store } from "redux";
import createSagaMiddleware from "redux-saga";
import { appReducer, RootState } from "./rootReducer";
import { rootSaga } from "./sagas";

const bindMiddleware = (middleware: any) => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
    const { composeWithDevTools } = require("@redux-devtools/extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

export const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store: Store<RootState, Action, {}> = createStore(appReducer, bindMiddleware([sagaMiddleware]));

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootStateInf = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<Store<RootState>>(makeStore, { debug: false });
