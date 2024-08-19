import React from "react";
import RadioButton from "./RadioButton";
import { render } from "../../utils/tests";

describe("RadioButton snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<RadioButton selected />);
    expect(test).toMatchSnapshot();
  });
  it("should render not selected", async () => {
    const test = await render(<RadioButton selected={false} />);
    expect(test).toMatchSnapshot();
  });
});
