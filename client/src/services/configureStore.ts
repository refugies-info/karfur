import { createStore, applyMiddleware, compose } from "redux";
import { rootReducer } from "./rootReducer";
import { sagaMiddleware, middlewares } from "./middlewares";
import { rootSaga } from "./sagas";

export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middlewares),
    // @ts-ignore : TO DO type window
    (window.__REDUX_DEVTOOLS_EXTENSION__ &&
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__()) ||
      compose
  )
);

sagaMiddleware.run(rootSaga);
