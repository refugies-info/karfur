import React from "react";
import HeaderTitle from "./HeaderTitle";
import { render } from "../../../utils/tests";

describe("HeaderTitle snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<HeaderTitle>Mon titre</HeaderTitle>);
    expect(test).toMatchSnapshot();
  });
});
