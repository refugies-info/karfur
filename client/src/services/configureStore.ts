import { createStore, applyMiddleware, compose } from "redux";
import { appReducer } from "./rootReducer";
import { rootSaga } from "./sagas";
// import { createBrowserHistory } from "history";
// import ReactGA from "react-ga";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();

/*
export const history = createBrowserHistory();
history.listen((location) => {
  ReactGA.pageview(location.pathname + location.search);
});
*/

export const store = createStore(
  appReducer(),
  compose(
    applyMiddleware(sagaMiddleware),
    /*( process.env.NEXT_PUBLIC_REACT_APP_ENV === "development" &&
      // @ts-ignore : TO DO type window
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__())  ||*/
      compose
  )
);

sagaMiddleware.run(rootSaga);
