import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./rootReducer";

export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    // @ts-ignore : TO DO type window
    (window.__REDUX_DEVTOOLS_EXTENSION__ &&
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__()) ||
      compose
  )
);
