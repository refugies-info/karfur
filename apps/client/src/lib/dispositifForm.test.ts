import { ContentType, type GetDispositifResponse } from "@refugies-info/api-types";
import { getDefaultValue } from "./dispositifForm";

describe("getDefaultValue", () => {
  it("should handle mixed sponsors (objects and strings)", () => {
    const dispositifStub = {
      typeContenu: ContentType.DISPOSITIF,
      sponsors: [
        { name: "Sponsor 1" },
        "5ce57c969aadae8734c7aeec", // ID string
        { name: "Sponsor 2", link: "http://example.com" },
      ],
    } as unknown as GetDispositifResponse;

    const result = getDefaultValue(dispositifStub);

    expect(result.sponsors).toHaveLength(3);
    expect(result.sponsors?.[0]).toEqual({ name: "Sponsor 1" });
    expect(result.sponsors?.[1]).toBe("5ce57c969aadae8734c7aeec"); // Should remain string!
    expect(result.sponsors?.[2]).toEqual({
      name: "Sponsor 2",
      link: "http://example.com",
    });
  });

  it("should handle fully populated sponsors", () => {
    const dispositifStub = {
      typeContenu: ContentType.DISPOSITIF,
      sponsors: [{ name: "Sponsor 1" }],
    } as unknown as GetDispositifResponse;

    const result = getDefaultValue(dispositifStub);

    expect(result.sponsors).toHaveLength(1);
    expect(result.sponsors?.[0]).toEqual({ name: "Sponsor 1" });
  });

  it("should handle undefined sponsors", () => {
    const dispositifStub = {
      typeContenu: ContentType.DISPOSITIF,
    } as unknown as GetDispositifResponse;

    const result = getDefaultValue(dispositifStub);

    expect(result.sponsors).toBeUndefined();
  });

  it("should convert populated ContentStructure to ID string", () => {
    const dispositifStub = {
      typeContenu: ContentType.DISPOSITIF,
      sponsors: [
        { name: "Sponsor 1" },
        { _id: "507f1f77bcf86cd799439012", nom: "Populated Structure" },
      ],
    } as unknown as GetDispositifResponse;

    const result = getDefaultValue(dispositifStub);

    expect(result.sponsors).toHaveLength(2);
    expect(result.sponsors?.[0]).toEqual({ name: "Sponsor 1" });
    expect(result.sponsors?.[1]).toBe("507f1f77bcf86cd799439012");
  });
});

describe("getDefaultValue - legacy sessions", () => {
  const buildDispositif = (sessions: unknown) =>
    ({
      typeContenu: ContentType.DISPOSITIF,
      metadatas: { location: ["56 - Morbihan"], sessions },
    }) as unknown as GetDispositifResponse;

  it("should convert an empty legacy sessions array to null", () => {
    const result = getDefaultValue(buildDispositif([]));

    expect(result.metadatas?.sessions).toBeNull();
  });

  it("should wrap a filled legacy sessions array into a SessionsMetadata object", () => {
    const session = { startDate: "2026-01-01", endDate: "2026-01-31" };
    const result = getDefaultValue(buildDispositif([session]));

    expect(result.metadatas?.sessions).toEqual({ items: [session] });
  });

  it("should leave an already migrated sessions object untouched", () => {
    const sessions = { modalitesEntreesSorties: 1, items: [] };
    const result = getDefaultValue(buildDispositif(sessions));

    expect(result.metadatas?.sessions).toEqual(sessions);
  });

  it("should keep the other metadatas untouched", () => {
    const result = getDefaultValue(buildDispositif([]));

    expect(result.metadatas?.location).toEqual(["56 - Morbihan"]);
  });
});
