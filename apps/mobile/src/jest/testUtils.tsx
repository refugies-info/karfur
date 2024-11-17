import { NavigationContext } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { render } from "@testing-library/react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from "redux";
import { initialRootStateFactory, rootReducer } from "~/services/redux/reducers";
import { ThemeProvider } from "~/theme";
import { ProfileParamList } from "~/types/navigation";

export const createTestStore = (initialState = initialRootStateFactory()) => {
  return createStore(rootReducer, initialState);
};

export const createNavigationMock = <
  ParamList extends Record<string, object | undefined> = ProfileParamList,
  RouteName extends keyof ParamList = "ProfilScreen",
  NavigatorID extends string | undefined = undefined,
>(): StackNavigationProp<ParamList, RouteName, NavigatorID> =>
  ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    isFocused: jest.fn(() => true),
    dispatch: jest.fn(),
    reset: jest.fn(),
    setParams: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    replace: jest.fn(),
    popToTop: jest.fn(),
    canGoBack: jest.fn(() => true),
    getId: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
  }) as unknown as StackNavigationProp<ParamList, RouteName, NavigatorID>;

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    initialState = initialRootStateFactory(),
    store = createTestStore(initialState),
    navigationMock = createNavigationMock(),
    ...renderOptions
  } = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <SafeAreaProvider>
      <NavigationContext.Provider value={navigationMock as any}>
        <Provider store={store}>
          <ThemeProvider>{children}</ThemeProvider>
        </Provider>
      </NavigationContext.Provider>
    </SafeAreaProvider>
  );

  return {
    store,
    navigationMock,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
