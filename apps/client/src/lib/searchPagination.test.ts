import { MAX_SEARCH_LIMIT, parsePaginationParam } from "./search-helpers";

describe("parsePaginationParam", () => {
  it("returns the fallback when the value is missing or not a number", () => {
    expect(parsePaginationParam(undefined, 10)).toBe(10);
    expect(parsePaginationParam("abc", 10)).toBe(10);
  });

  it("returns the fallback for zero and negative values", () => {
    expect(parsePaginationParam("0", 10)).toBe(10);
    expect(parsePaginationParam("-5", 10)).toBe(10);
  });

  it("keeps a valid value", () => {
    expect(parsePaginationParam("24", 10, MAX_SEARCH_LIMIT)).toBe(24);
  });

  it("caps the value at the maximum", () => {
    expect(parsePaginationParam("1000000", 10, MAX_SEARCH_LIMIT)).toBe(MAX_SEARCH_LIMIT);
  });
});
