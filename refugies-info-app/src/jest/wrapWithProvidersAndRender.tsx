import React from "react";
import { render } from "react-native-testing-library";
import { Provider } from "react-redux";
import { createStore } from "redux";
import {
  initialRootStateFactory,
  rootReducer,
  RootState,
} from "../services/redux/reducers";

interface WrapWithProvidersAndRenderParams {
  Component: React.FunctionComponent<unknown>;
  compProps?: Record<string, unknown>;
  reduxState?: Partial<RootState>;
}

/**
 * Provide all the ugly-to-set-up providers for your component to be ready to test
 * @param Component
 * @param compProps properties passed on to [getPropsWithNavigation()] to gen navigation props
 * @param reduxState defaults to initialRootState
 */
export function wrapWithProvidersAndRender({
  Component,
  compProps = {},
  reduxState = initialRootStateFactory(),
}: WrapWithProvidersAndRenderParams) {
  const store = createStore(rootReducer, reduxState);

  const componentWithReduxAndI18n = (
    <Provider store={store}>
      <Component {...compProps} />
    </Provider>
  );

  return render(componentWithReduxAndI18n);
}
