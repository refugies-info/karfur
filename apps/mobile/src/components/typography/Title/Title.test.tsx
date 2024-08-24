import React from "react";
import Title from "./Title";
import { render } from "../../utils/tests";

describe("Title snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<Title>Mon titre</Title>);
    expect(test).toMatchSnapshot();
  });
});
