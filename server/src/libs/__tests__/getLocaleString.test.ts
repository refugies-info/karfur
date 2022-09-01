// @ts-nocheck
import { getLocaleString } from "../getLocaleString";

jest.mock("../../locales/fr/common.json", () => ({
  "teststring": "Test 1"
}));
jest.mock("../../locales/en/common.json", () => ({
  "nested": {
    "teststring": "Test 2"
  }
}));


describe("getLocaleString", () => {
  it("should return the translation", () => {
    const res = getLocaleString("fr", "teststring");
    expect(res).toEqual("Test 1");
  });
  it("should return the nested translation", () => {
    const res = getLocaleString("en", "nested.teststring");
    expect(res).toEqual("Test 2");
  });
  it("should return the key if not found", () => {
    const res = getLocaleString("fr", "notfound");
    expect(res).toEqual("notfound");
  });
});
