import { TooltipProvider } from "@radix-ui/react-tooltip";
import { render } from "@testing-library/react";
import { initialMockStore } from "__fixtures__/reduxStore";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import { RootState } from "services/rootReducer";

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
