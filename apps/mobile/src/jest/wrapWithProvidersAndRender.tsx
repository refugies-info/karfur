import { NavigationContext } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from "redux";
import { initialRootStateFactory, rootReducer, RootState } from "../services/redux/reducers";
import { ThemeProvider } from "../theme";

interface WrapWithProvidersAndRenderParams {
  Component: React.FunctionComponent<any>;
  compProps?: Record<string, any>;
  reduxState?: RootState;
}

const navContext = {
  isFocused: () => true,
  addListener: jest.fn(() => jest.fn()),
};

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
    <SafeAreaProvider>
      <NavigationContext.Provider value={navContext as any}>
        <Provider store={store}>
          <ThemeProvider>
            <Component {...compProps} />
          </ThemeProvider>
        </Provider>
      </NavigationContext.Provider>
    </SafeAreaProvider>
  );
  // let component;

  // await act(async () => (component = render(componentWithReduxAndI18n)));
  // return component;
  return render(componentWithReduxAndI18n);
}
