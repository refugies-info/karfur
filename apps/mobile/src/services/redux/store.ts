import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { middlewares, sagaMiddleware } from "./middlewares";
import { rootReducer } from "./reducers";
import { rootSaga } from "./sagas";

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

sagaMiddleware.run(rootSaga);
