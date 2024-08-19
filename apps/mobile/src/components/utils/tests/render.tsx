import React, { ReactNode } from "react";
import renderer, { act } from "react-test-renderer";
import { ThemeProvider } from "../../../theme";

const render = async (JSX: ReactNode, toJson = true, doAct = false) => {
  let tree: any = { toJSON: () => undefined };
  if (doAct) {
    await act(async () => {
      tree = renderer.create(<ThemeProvider>{JSX}</ThemeProvider>);
    });
  } else {
    tree = renderer.create(<ThemeProvider>{JSX}</ThemeProvider>);
  }
  return toJson ? tree.toJSON() : tree;
};
export default render;
