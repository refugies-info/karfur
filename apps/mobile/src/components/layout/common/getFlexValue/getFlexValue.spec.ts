import getFlexValue from "./getFlexValue";

describe("getFlexValue test suite", () => {
  it("should return flex value by index 1", () => {
    expect(getFlexValue("1 0 2", 1)).toEqual("0");
  });

  it("should return empty string if no flex value is given", () => {
    expect(getFlexValue("", 2)).toEqual("");
  });

  it("should cycle with given value if given index is out of bound", () => {
    expect(getFlexValue("1 2", 4)).toEqual("1");
  });
});
