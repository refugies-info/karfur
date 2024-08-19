import isLastChild from "./isLastChild";

describe("isLastChild test suite", () => {
  it("should return true if index target the last item", () => {
    expect(isLastChild([1, 2, 3], 2)).toBeTruthy();
  });

  it("should return false if index doesn't taget the last item", () => {
    expect(isLastChild([1, 2, 3], 1)).toBeFalsy();
  });

  it("should return ", () => {
    expect(isLastChild([4], 0)).toBeTruthy();
  });
});
