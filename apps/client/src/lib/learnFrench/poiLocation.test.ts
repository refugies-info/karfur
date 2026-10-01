import type { Poi } from "@refugies-info/api-types";
import { getPoiLocationText } from "./poiLocation";

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
});
