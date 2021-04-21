// @ts-nocheck
import React from "react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { RootState } from "../../src/services/rootReducer";
import { initialMockStore } from "../../src/__fixtures__/reduxStore";
import { BrowserRouter as Router } from "react-router-dom";

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
  // @ts-ignore
  reduxState = initialMockStore,
}: WrapWithProvidersAndRenderParams) {
  const mockStore = configureStore([]);

  const store = mockStore(reduxState);

  const componentWithRedux = (
    <Router>
      <Provider store={store}>
        <Component {...compProps} />
      </Provider>
    </Router>
  );

  return renderer.create(componentWithRedux);
}
