import { carifOrefCenters, getCarifOrefCenterByLocation } from "../carifOrefCenters";

describe("getCarifOrefCenterByLocation", () => {
  it("finds the Carif-Oref covering the departments of a dispositif", () => {
    const center = getCarifOrefCenterByLocation([
      "75 - Paris",
      "77 - Seine-et-Marne",
      "95 - Val-d'Oise",
    ]);

    expect(center?.name).toBe("Région Île-de-France");
    expect(center?.region).toBe("Île-de-France");
    expect(center?.logoUrl).toBe("/images/sources/carif-oref-ile-de-france.webp");
  });

  it("handles overseas department codes", () => {
    expect(getCarifOrefCenterByLocation(["974 - La Réunion"])?.codes).toEqual(["25"]);
    expect(getCarifOrefCenterByLocation(["971 - Guadeloupe"])?.codes).toEqual(["11"]);
  });

  it("resolves Corsica, whose contents carry a Carif number missing from RCO's table", () => {
    expect(getCarifOrefCenterByLocation(["2A - Corse-du-Sud", "2B - Haute-Corse"])?.region).toBe(
      "Corse",
    );
  });

  it("returns nothing for nationwide, online or missing locations", () => {
    expect(getCarifOrefCenterByLocation("france")).toBeUndefined();
    expect(getCarifOrefCenterByLocation("online")).toBeUndefined();
    expect(getCarifOrefCenterByLocation(null)).toBeUndefined();
    expect(getCarifOrefCenterByLocation([])).toBeUndefined();
  });

  it("maps every department to a single Carif-Oref", () => {
    const allDepartments = carifOrefCenters.flatMap((center) => center.departments);

    expect(new Set(allDepartments).size).toBe(allDepartments.length);
  });
});
