import React from "react";
import SkeletonListPage from "./SkeletonListPage";
import { render } from "../../utils/tests";

describe("SkeletonListPage snapshot test suite", () => {
  it("should render without bug", () => {
    const test = render(<SkeletonListPage />);
    expect(test).toMatchSnapshot();
  });
});
