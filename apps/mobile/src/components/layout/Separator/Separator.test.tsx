import React from "react";
import Separator from "./Separator";
import { render } from "../../utils/tests";

describe("Separator snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<Separator />);
    expect(test).toMatchSnapshot();
  });
});
