import { getDepartmentBadge } from "./departmentBadge";

const LOCATIONS = ["75 - Paris", "31 - Haute-Garonne", "21 - Côte-d'Or"];

describe("getDepartmentBadge", () => {
  it("shows the first department of the course when nothing is searched", () => {
    expect(getDepartmentBadge(LOCATIONS, [])).toEqual("Paris");
  });

  it("shows the searched department even when it is not the first one", () => {
    expect(getDepartmentBadge(LOCATIONS, ["Côte-d'Or"])).toEqual("Côte-d'Or");
  });

  it("accepts a searched department written as a full location", () => {
    expect(getDepartmentBadge(LOCATIONS, ["21 - Côte-d'Or"])).toEqual("Côte-d'Or");
  });

  it("ignores case and accents when matching", () => {
    expect(getDepartmentBadge(LOCATIONS, ["cote-d'or"])).toEqual("Côte-d'Or");
  });

  it("keeps the first searched department of the course when several match", () => {
    expect(getDepartmentBadge(LOCATIONS, ["Haute-Garonne", "Côte-d'Or"])).toEqual("Haute-Garonne");
  });

  it("falls back to the first department when none of the searched ones is available", () => {
    expect(getDepartmentBadge(LOCATIONS, ["Rhône"])).toEqual("Paris");
  });

  it("handles a single location given as a string", () => {
    expect(getDepartmentBadge("21 - Côte-d'Or", [])).toEqual("Côte-d'Or");
  });

  it("returns null for online, France-wide or missing locations", () => {
    expect(getDepartmentBadge("online", ["Côte-d'Or"])).toBeNull();
    expect(getDepartmentBadge("france", [])).toBeNull();
    expect(getDepartmentBadge(undefined, [])).toBeNull();
    expect(getDepartmentBadge([], [])).toBeNull();
  });
});
