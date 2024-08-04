import { TooltipProvider } from "@radix-ui/react-tooltip";
import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import renderer from "react-test-renderer";
import configureStore from "redux-mock-store";
import { RootState } from "services/rootReducer";
import { initialMockStore } from "__fixtures__/reduxStore";

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

/**
 * Provide all the ugly-to-set-up providers for your component to be ready to test
 * @param Component
 * @param compProps properties passed on to [getPropsWithNavigation()] to gen navigation props
 * @param reduxState defaults to initialRootState
 */

export function wrapWithProvidersAndRenderForTesting<T>({
  Component,
  compProps,
  reduxState = initialMockStore,
}: WrapWithProvidersAndRenderParams<T>) {
  const mockStore = configureStore([]);
  const store = mockStore(reduxState);

  const componentWithRedux = (
    <TooltipProvider>
      <Router>
        <Provider store={store}>
          <Component {...compProps} />
        </Provider>
      </Router>
    </TooltipProvider>
  );

  return render(componentWithRedux);
}
