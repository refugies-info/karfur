import React from "react";
import SectionTitle from "./SectionTitle";
import { render } from "../../utils/tests";

describe("SectionTitle snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<SectionTitle>Mon sous titre</SectionTitle>);
    expect(test).toMatchSnapshot();
  });
});
