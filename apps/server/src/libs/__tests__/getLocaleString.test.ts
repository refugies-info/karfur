// @ts-nocheck
import { getLocaleString } from "../getLocaleString";

jest.mock("../../locales/fr/common.json", () => ({
  "teststring": "Test 1",
  "testparam": "test {{param}} sentence",
  "testparams": "test {{param}} sentence with {{count}} params",
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
  it("should replace 1 param", () => {
    const res = getLocaleString("fr", "testparam", { param: "example" });
    expect(res).toEqual("test example sentence");
  });
  it("should replace 2 params", () => {
    const res = getLocaleString("fr", "testparams", { param: "example", count: 2 });
    expect(res).toEqual("test example sentence with 2 params");
  });
});
