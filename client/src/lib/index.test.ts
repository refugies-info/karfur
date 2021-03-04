// @ts-nocheck
import {
  jsUcfirst,
  limitNbCaracters,
  removeAccents,
  computePasswordStrengthScore,
} from "./index";

describe("jsUcfirst", () => {
  it("should return first letter upercase", () => {
    const res = jsUcfirst("test");
    expect(res).toEqual("Test");
  });

  it("should return first letter upercase", () => {
    const res = jsUcfirst("tESt");
    expect(res).toEqual("TESt");
  });

  it("should return first letter upercase", () => {
    const res = jsUcfirst("Test");
    expect(res).toEqual("Test");
  });
});

describe("limitNbCaracters", () => {
  it("should return the input string", () => {
    const res = limitNbCaracters("test", 5);
    expect(res).toEqual("test");
  });

  it("should return input string cut", () => {
    const res = limitNbCaracters("long test", 5);
    expect(res).toEqual("long ...");
  });
});

describe("removeAccents", () => {
  it("should remove accents", () => {
    const res = removeAccents("élève");
    expect(res).toEqual("eleve");
  });

  it("should return first letter upercase", () => {
    const res = removeAccents("Èçà");
    expect(res).toEqual("Eca");
  });
});

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
