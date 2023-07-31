import React from "react";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { RootState } from "services/rootReducer";
import { initialMockStore } from "__fixtures__/reduxStore";
import { BrowserRouter as Router } from "react-router-dom";

interface WrapWithProvidersAndRenderParams<Props> {
  Component: React.FunctionComponent<any>;
  compProps?: Props;
  reduxState?: Partial<RootState>;
}

/**
 * Provide all the ugly-to-set-up providers for your component to be ready to test
 * @param Component
 * @param compProps properties passed on to [getPropsWithNavigation()] to gen navigation props
 * @param reduxState defaults to initialRootState
 */

export function wrapWithProvidersAndRender<T>({
  Component,
  compProps,
  reduxState = initialMockStore,
}: WrapWithProvidersAndRenderParams<T>) {
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
