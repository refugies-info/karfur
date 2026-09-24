import {
  carifOrefCenters,
  getCarifOrefCenterByLocation,
  getCarifOrefCenterByOriginId,
} from "../carifOrefCenters";

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

describe("getCarifOrefCenterByOriginId", () => {
  it("reads the Carif number from an RCO content id", () => {
    const center = getCarifOrefCenterByOriginId("carif-oref--14_SE_0001847289");

    expect(center?.name).toBe("Région Île-de-France");
    expect(center?.logoUrl).toBe("/images/sources/carif-oref-ile-de-france.webp");
  });

  it("ignores the leading zero RCO puts on single digit numbers", () => {
    expect(getCarifOrefCenterByOriginId("carif-oref--07_816811S")?.name).toBe(
      "GIP Alfa Centre-Val de Loire",
    );
    expect(getCarifOrefCenterByOriginId("carif-oref--06_2353075S")?.name).toBe("GREF Bretagne");
  });

  it("resolves Carifs sharing several numbers", () => {
    expect(getCarifOrefCenterByOriginId("carif-oref--02_00540249")?.region).toBe(
      "Nouvelle-Aquitaine",
    );
    expect(getCarifOrefCenterByOriginId("carif-oref--23_123456")?.region).toBe(
      "Nouvelle-Aquitaine",
    );
  });

  it("returns nothing for an unknown number, a foreign id or no id at all", () => {
    expect(getCarifOrefCenterByOriginId("carif-oref--99_123456")).toBeUndefined();
    expect(getCarifOrefCenterByOriginId("dora--123456")).toBeUndefined();
    expect(getCarifOrefCenterByOriginId(undefined)).toBeUndefined();
    expect(getCarifOrefCenterByOriginId("")).toBeUndefined();
  });

  it("maps every Carif number to a single Carif-Oref", () => {
    const allCodes = carifOrefCenters.flatMap((center) => center.codes);

    expect(new Set(allCodes).size).toBe(allCodes.length);
  });
});
