import React, { ReactNode } from "react";
import renderer from "react-test-renderer";
import { ThemeProvider } from "../../../theme";

const render = (JSX: ReactNode, toJson = true) => {
  const tree = renderer.create(<ThemeProvider>{JSX}</ThemeProvider>);
  return toJson ? tree.toJSON() : tree;
};
export default render;
