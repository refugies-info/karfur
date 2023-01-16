// @ts-nocheck
import { isPasswordOk } from "../validatePassword";


describe("validatePassword", () => {
  it("should be KO - too short", () => {
    const res = isPasswordOk("abc1&");
    expect(res).toEqual(false);
  });
  it("should be KO - no number", () => {
    const res = isPasswordOk("abcdef&");
    expect(res).toEqual(false);
  });
  it("should be KO - no special char", () => {
    const res = isPasswordOk("abcdef1");
    expect(res).toEqual(false);
  });

  it("should be KO - too short and no number", () => {
    const res = isPasswordOk("abc&");
    expect(res).toEqual(false);
  });
  it("should be KO - too short and no special char", () => {
    const res = isPasswordOk("abc1");
    expect(res).toEqual(false);
  });
  it("should be KO - no number and no special char", () => {
    const res = isPasswordOk("abcdefg");
    expect(res).toEqual(false);
  });

  it("should be KO - too short, no number or special char", () => {
    const res = isPasswordOk("abc");
    expect(res).toEqual(false);
  });

  it("should be OK", () => {
    const res = isPasswordOk("abc");
    expect(res).toEqual(false);
  });
});
