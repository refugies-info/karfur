import { DispositifOrigin, type GetDispositifResponse } from "@refugies-info/api-types";
import { getDispositifMarkdown } from "./getDispositifMarkdown";

const buildDispositif = (props: Partial<GetDispositifResponse>) =>
  props as unknown as GetDispositifResponse;

describe("getDispositifMarkdown", () => {
  it("should return null when there is no dispositif", () => {
    expect(getDispositifMarkdown(null, "fr")).toBe(null);
    expect(getDispositifMarkdown(undefined, "fr")).toBe(null);
  });

  it("should return null for an RI dispositif, whose body is HTML", () => {
    const dispositif = buildDispositif({
      origin: DispositifOrigin.RI,
      what: "<p>Un contenu</p>",
    });
    expect(getDispositifMarkdown(dispositif, "fr")).toBe(null);
  });

  it("should return null when the origin is missing", () => {
    expect(getDispositifMarkdown(buildDispositif({ markdown: "# Titre" }), "fr")).toBe(null);
  });

  it("should return the top-level markdown of an RCO dispositif", () => {
    const dispositif = buildDispositif({
      origin: DispositifOrigin.RCO,
      markdown: "# Titre",
    });
    expect(getDispositifMarkdown(dispositif, "fr")).toBe("# Titre");
  });

  it("should prefer the top-level markdown, already resolved for the requested locale", () => {
    const dispositif = buildDispositif({
      origin: DispositifOrigin.RCO,
      markdown: "# Title",
      translations: {
        en: { content: { markdown: "# Legacy" } },
      } as GetDispositifResponse["translations"],
    });
    expect(getDispositifMarkdown(dispositif, "en")).toBe("# Title");
  });

  it("should fall back to the translation of the legacy data shape", () => {
    const dispositif = buildDispositif({
      origin: DispositifOrigin.RCO,
      translations: {
        en: { content: { markdown: "# Title" } },
      } as GetDispositifResponse["translations"],
    });
    expect(getDispositifMarkdown(dispositif, "en")).toBe("# Title");
  });

  it("should return null when the translation carries no markdown", () => {
    const dispositif = buildDispositif({
      origin: DispositifOrigin.RCO,
      translations: {
        en: { content: { what: "<p>Un contenu</p>" } },
      } as GetDispositifResponse["translations"],
    });
    expect(getDispositifMarkdown(dispositif, "en")).toBe(null);
  });

  it("should return null when there is no translation for the language", () => {
    const dispositif = buildDispositif({
      origin: DispositifOrigin.RCO,
      translations: {
        en: { content: { markdown: "# Title" } },
      } as GetDispositifResponse["translations"],
    });
    expect(getDispositifMarkdown(dispositif, "uk")).toBe(null);
  });
});
