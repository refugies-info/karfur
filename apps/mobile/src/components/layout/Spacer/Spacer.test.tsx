import React from "react";
import Spacer from "./Spacer";
import { render } from "../../utils/tests";

describe("Spacer snapshot test suite", () => {
  it("should render without bug / height", async () => {
    const test = await render(<Spacer height={42} />);
    expect(test).toMatchSnapshot();
  });
  it("should render without bug / width", async () => {
    const test = await render(<Spacer width={42} />);
    expect(test).toMatchSnapshot();
  });
  it("should render without bug / height & width", async () => {
    const test = await render(<Spacer height={42} width={42} />);
    expect(test).toMatchSnapshot();
  });
});
