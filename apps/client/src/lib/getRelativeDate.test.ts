import { getRelativeTimeString } from "~/lib/getRelativeDate";

jest.mock("next-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("getRelativeDate", () => {
  const mockDate = new Date("2024-12-31T00:00:00Z");

  beforeAll(() => {
    jest.spyOn(Date, "now").mockImplementation(() => mockDate.getTime());
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should return updated yesterday", () => {
    //@ts-expect-error
    const res = getRelativeTimeString(new Date("2024-12-30"), "fr", (key) => key);
    expect(res).toEqual("Dispositif.updated hier");
  });

  it("should return updated 3 days", () => {
    //@ts-expect-error
    const res = getRelativeTimeString(new Date("2024-12-28"), "fr", (key) => key);
    expect(res).toEqual("Dispositif.updated il y a 3 jours");
  });

  it("should return updated 1 month", () => {
    //@ts-expect-error
    const res = getRelativeTimeString(new Date("2024-12-01"), "fr", (key) => key);
    expect(res).toEqual("Dispositif.updated le mois dernier");
  });

  it("should return updated 3 months", () => {
    //@ts-expect-error
    const res = getRelativeTimeString(new Date("2024-09-10"), "fr", (key) => key);
    expect(res).toEqual("Dispositif.updated il y a 4 mois");
  });

  it("should return updated more than 1 year", () => {
    //@ts-expect-error
    const res = getRelativeTimeString(new Date("2023-11-01"), "fr", (key) => key);
    expect(res).toEqual("Dispositif.more_1_year");
  });
});
