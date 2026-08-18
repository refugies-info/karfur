import { Platform } from "react-native";
import { getBottomInset } from "../getBottomInset";

describe("getBottomInset", () => {
  it("should return 0 when there is no inset", () => {
    expect(getBottomInset(0)).toEqual(0);
  });

  describe("on android", () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, "OS", "android");
    });

    it("should reserve the whole inset of a 3-button navigation bar, plus a gap", () => {
      expect(getBottomInset(48)).toEqual(56);
    });

    it("should reserve the whole inset of a gesture navigation bar, plus a gap", () => {
      expect(getBottomInset(24)).toEqual(32);
    });
  });

  describe("on ios", () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, "OS", "ios");
    });

    it("should trim 8px off the home indicator inset", () => {
      expect(getBottomInset(34)).toEqual(26);
    });

    it("should never return a negative padding", () => {
      expect(getBottomInset(4)).toEqual(0);
    });
  });
});
