import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { render } from "@testing-library/react";
import { initialMockStore } from "__fixtures__/reduxStore";
import type React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import type { RootState } from "services/rootReducer";
import { ScreenReaderAnnouncerProvider } from "~/components/Accessibility/ScreenReaderAnnouncer";

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
    <ToastProvider swipeDirection="down">
      <TooltipProvider>
        <Router>
          <Provider store={store}>
            <ScreenReaderAnnouncerProvider>
              <Component {...compProps} />
            </ScreenReaderAnnouncerProvider>
          </Provider>
        </Router>
      </TooltipProvider>
      <ToastViewport />
    </ToastProvider>
  );

  return render(componentWithRedux);
}
