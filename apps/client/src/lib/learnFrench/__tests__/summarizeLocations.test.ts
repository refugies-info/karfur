import { summarizeLocations } from "../summarizeLocations";

describe("summarizeLocations", () => {
  it("returns an empty string when no location is selected", () => {
    expect(summarizeLocations([])).toBe("");
  });

  it("joins locations with a comma when there are 2 or fewer", () => {
    expect(summarizeLocations(["Rennes"])).toBe("Rennes");
    expect(summarizeLocations(["Rennes", "Lyon"])).toBe("Rennes, Lyon");
  });

  it("keeps the first 2 locations and counts the rest", () => {
    expect(summarizeLocations(["Rennes", "Lyon", "Paris"])).toBe("Rennes, Lyon, +1");
    expect(summarizeLocations(["Rennes", "Lyon", "Paris", "Nantes"])).toBe("Rennes, Lyon, +2");
  });
});
