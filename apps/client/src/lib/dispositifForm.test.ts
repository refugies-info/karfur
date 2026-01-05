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
