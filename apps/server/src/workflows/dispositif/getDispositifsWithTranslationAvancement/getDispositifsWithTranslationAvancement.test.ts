import { ContentType, DispositifOrigin, TraductionsStatus } from "@refugies-info/api-types";
import type { Dispositif } from "@refugies-info/mongo";
import { ObjectId } from "@refugies-info/mongo";
import { getActiveContents } from "~/modules/dispositif/dispositif.repository";
import { getTraductionsByLanguage } from "~/modules/traductions/traductions.repository";
import { getDispositifsWithTranslationAvancement } from "./getDispositifsWithTranslationAvancement";

jest.mock("~/logger", () => ({
  info: jest.fn(),
}));

jest.mock("~/modules/dispositif/dispositif.repository", () => ({
  getActiveContents: jest.fn(),
}));

jest.mock("~/modules/traductions/traductions.repository", () => ({
  getTraductionsByLanguage: jest.fn(),
}));

const getActiveContentsMock = getActiveContents as jest.MockedFunction<typeof getActiveContents>;
const getTraductionsByLanguageMock = getTraductionsByLanguage as jest.MockedFunction<
  typeof getTraductionsByLanguage
>;

const buildDispositif = (
  title: string,
  origin?: DispositifOrigin,
  overrides: Partial<Dispositif> = {},
): Dispositif =>
  ({
    _id: new ObjectId(),
    created_at: new Date("2026-06-08T08:00:00.000Z"),
    nbMots: 10,
    origin,
    translations: {
      fr: {
        content: {
          titreInformatif: title,
          titreMarque: `${title} - marque`,
          abstract: "Résumé",
          what: "Texte français à traduire",
          why: {},
          how: {},
        },
      },
    },
    typeContenu: ContentType.DISPOSITIF,
    webOnly: false,
    ...overrides,
  }) as unknown as Dispositif;

describe("getDispositifsWithTranslationAvancement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getTraductionsByLanguageMock.mockResolvedValue([]);
  });

  it("returns only RI-origin contents in the translation backlog", async () => {
    const riDispositif = buildDispositif("Fiche RI", DispositifOrigin.RI);
    const rcoDispositif = buildDispositif("Fiche RCO", DispositifOrigin.RCO);
    const legacyDispositif = buildDispositif("Fiche legacy sans origin");

    getActiveContentsMock.mockResolvedValue([riDispositif, rcoDispositif, legacyDispositif]);

    const result = await getDispositifsWithTranslationAvancement("en");

    expect(getActiveContentsMock).toHaveBeenCalledWith(expect.objectContaining({ origin: 1 }));
    expect(result).toHaveLength(2);
    expect(result.map((dispositif) => dispositif._id)).toEqual([
      riDispositif._id.toString(),
      legacyDispositif._id.toString(),
    ]);
    expect(result.map((dispositif) => dispositif.tradStatus)).toEqual([
      TraductionsStatus.TO_TRANSLATE,
      TraductionsStatus.TO_TRANSLATE,
    ]);
  });

  it("excludes RCO contents even when they would otherwise appear as pending validation", async () => {
    const rcoDispositif = buildDispositif("Fiche RCO à valider", DispositifOrigin.RCO, {
      // Without the origin filter, a content with no missing words would fall into PENDING.
      nbMots: 0,
    });

    getActiveContentsMock.mockResolvedValue([rcoDispositif]);

    const result = await getDispositifsWithTranslationAvancement("en");

    expect(result).toEqual([]);
  });
});
