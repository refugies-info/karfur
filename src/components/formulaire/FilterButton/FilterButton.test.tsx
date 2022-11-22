import React from "react";
import FilterButton from "./FilterButton";
import { render } from "../../utils/tests";

describe("FilterButton snapshot test suite", () => {
  it("should render without bug", async () => {
    const test = await render(
      <FilterButton text="Test choice" onPress={() => null} isSelected />
    );
    expect(test).toMatchSnapshot();
  });

  it("should render not selected", async () => {
    const test = await render(
      <FilterButton
        text="Test choice"
        onPress={() => null}
        isSelected={false}
      />
    );
    expect(test).toMatchSnapshot();
  });

  it("should render with detail", async () => {
    const test = await render(
      <FilterButton
        details={["First detail", "Second detail"]}
        text="Test choice"
        onPress={() => null}
        isSelected
      />
    );
    expect(test).toMatchSnapshot();
  });
});
