import type { Poi } from "@refugies-info/api-types";
import { getPoiDistinctTitle, getPoiLocationText } from "./poiLocation";

const poi = (overrides: Partial<Poi>): Poi => ({
  title: "Centre",
  address: "",
  lat: 0,
  lng: 0,
  ...overrides,
});

describe("getPoiLocationText", () => {
  it("returns an empty string when there is no address or city", () => {
    expect(getPoiLocationText(undefined)).toEqual("");
    expect(getPoiLocationText(poi({ address: "" }))).toEqual("");
  });

  it("returns the city alone when there is no address", () => {
    expect(getPoiLocationText(poi({ address: "", city: "Lyon" }))).toEqual("Lyon");
  });

  it("appends the city when it is not already part of the address", () => {
    expect(getPoiLocationText(poi({ address: "12 rue de la Paix, 75002", city: "Paris" }))).toEqual(
      "12 rue de la Paix, 75002, Paris",
    );
  });

  it("does not duplicate the city when it is already in the address", () => {
    expect(
      getPoiLocationText(
        poi({
          address: "44 Boulevard Georges Clemenceau, 78200 Mantes-la-Jolie",
          city: "Mantes-la-Jolie",
        }),
      ),
    ).toEqual("44 Boulevard Georges Clemenceau, 78200 Mantes-la-Jolie");
  });

  it("returns the address alone when there is no city", () => {
    expect(getPoiLocationText(poi({ address: "12 rue de la Paix" }))).toEqual("12 rue de la Paix");
  });

  it("drops the trailing country", () => {
    expect(getPoiLocationText(poi({ address: "3 Rue Jean XXIII, 21000 Dijon, France" }))).toEqual(
      "3 Rue Jean XXIII, 21000 Dijon",
    );
  });

  it("does not append the city when the address already has a postcode", () => {
    expect(
      getPoiLocationText(
        poi({ address: "12 Rue d'Assas, 75006 Paris, France", city: "12 Rue d'Assas, Paris" }),
      ),
    ).toEqual("12 Rue d'Assas, 75006 Paris");
  });
});

describe("getPoiDistinctTitle", () => {
  it("returns null when the lieu has no title", () => {
    expect(getPoiDistinctTitle(undefined, "AGO")).toBeNull();
    expect(getPoiDistinctTitle(poi({ title: "" }), "AGO")).toBeNull();
  });

  it("hides the title when it repeats the structure name, ignoring case and accents", () => {
    expect(
      getPoiDistinctTitle(poi({ title: "Accueil Goutte d'Or" }), "accueil goutte d’or "),
    ).toBeNull();
    expect(getPoiDistinctTitle(poi({ title: "Forma.Clé" }), "Forma.Cle")).toBeNull();
  });

  it("keeps a title that adds information", () => {
    expect(getPoiDistinctTitle(poi({ title: "Cesam Dijon" }), "CESAM")).toEqual("Cesam Dijon");
    expect(getPoiDistinctTitle(poi({ title: "Bercail" }), undefined)).toEqual("Bercail");
  });
});
