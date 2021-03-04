// @ts-nocheck
import { computePasswordStrengthScore } from "../computePasswordStrengthScore";

describe("computePasswordStrengthScore", () => {
  it("should return 0 if length<5", () => {
    const res = computePasswordStrengthScore("ae56");
    expect(res).toEqual({ score: 0 });
  });

  it("should return 2 if no upper case or numeric length >=7", () => {
    const res = computePasswordStrengthScore("aejklsjhq");
    expect(res).toEqual({ score: 2 });
  });

  it("should return 1 if one upper case or numeric", () => {
    const res = computePasswordStrengthScore("aejkl1");
    expect(res).toEqual({ score: 1 });
  });

  it("should return 1 if one upper case or numeric", () => {
    const res = computePasswordStrengthScore("aejklA");
    expect(res).toEqual({ score: 1 });
  });

  it("should return 2 if 3 upper case or numeric", () => {
    const res = computePasswordStrengthScore("Eejkla9");
    expect(res).toEqual({ score: 2 });
  });

  it("should return 3 if 3 upper case or numeric and length>6", () => {
    const res = computePasswordStrengthScore("aejklA879sgqhsg");
    expect(res).toEqual({ score: 3 });
  });

  it("should return 4 if 3 upper case or numeric and length>6 and special character", () => {
    const res = computePasswordStrengthScore("aejklAB4!");
    expect(res).toEqual({ score: 4 });
  });
});
