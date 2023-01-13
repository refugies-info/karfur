// @ts-nocheck
import {
  jsUcfirst,
  limitNbCaracters,
  removeAccents,
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

