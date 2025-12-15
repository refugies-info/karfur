import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, createStore, type Store } from "redux";
import createSagaMiddleware from "redux-saga";
import { appReducer, type RootState } from "./rootReducer";
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
  const store = createStore(appReducer, bindMiddleware([sagaMiddleware]));

  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export const wrapper = createWrapper<Store<RootState>>(makeStore, { debug: false });
