import { render, RenderOptions } from "@testing-library/react-native";
import React, { ReactElement } from "react";
import { ThemeProvider } from "../../../theme";

const AllTheProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

export { customRender as render };
