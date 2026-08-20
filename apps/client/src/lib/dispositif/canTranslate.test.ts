import type { GetDispositifResponse } from "@refugies-info/api-types";
import { canTranslate } from "./canTranslate";

const dispositifTranslatedInUk = {
  _id: "dispositifObjectId",
  availableLanguages: ["fr", "uk"],
} as unknown as GetDispositifResponse;

describe("canTranslate", () => {
  it("should return true for an admin or expert whatever the language", () => {
    expect(canTranslate(dispositifTranslatedInUk, "uk", true)).toEqual(true);
  });

  it("should return false if the language is already translated", () => {
    expect(canTranslate(dispositifTranslatedInUk, "uk", false)).toEqual(false);
  });

  it("should return true if the language is not translated yet", () => {
    expect(canTranslate(dispositifTranslatedInUk, "ar", false)).toEqual(true);
  });

  it("should return true without crashing if availableLanguages is missing", () => {
    const dispositif = { _id: "dispositifObjectId" } as unknown as GetDispositifResponse;

    expect(canTranslate(dispositif, "uk", false)).toEqual(true);
  });
});
