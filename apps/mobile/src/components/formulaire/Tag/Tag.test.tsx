import React from "react";
import Tag from "./Tag";
import { render } from "../../utils/tests";

describe("Tag snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(<Tag onRemove={() => {}}>Test</Tag>);
    expect(test).toMatchSnapshot();
  });
});
