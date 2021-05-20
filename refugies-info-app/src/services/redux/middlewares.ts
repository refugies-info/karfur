import createSagaMiddleware from "redux-saga";

export const sagaMiddleware = createSagaMiddleware();

export const middlewares = [sagaMiddleware];
