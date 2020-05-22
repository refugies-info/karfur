import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";

import langueReducer from "./Reducers/langueReducer";
import dispositifReducer from "./Reducers/dispositifReducer";
import structureReducer from "./Reducers/structureReducer";
import userReducer from "./User/user.reducer";
import ttsReducer from "./Reducers/ttsReducer";

const rootReducer = combineReducers({
  langue: langueReducer,
  dispositif: dispositifReducer,
  user: userReducer,
  tts: ttsReducer,
  structure: structureReducer,
});

export default createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    (window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()) ||
      compose
  )
);
