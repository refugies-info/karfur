import type { SaveTranslationRequest } from "@refugies-info/api-types";
import type { User } from "@refugies-info/mongo";
import { ObjectId } from "@refugies-info/mongo";
import { ConflictError } from "~/errors";
import { getDispositifById } from "~/modules/dispositif/dispositif.repository";
import saveTranslation from "./saveTranslation";

jest.mock("~/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock("~/modules/dispositif/dispositif.repository", () => ({
  getDispositifById: jest.fn(),
  addNewParticipant: jest.fn(),
}));

jest.mock("~/modules/indicators/indicators.service", () => ({
  updateIndicator: jest.fn(),
}));

jest.mock("~/modules/traductions/traductions.repository", () => ({
  getOtherValidationForDispositif: jest.fn(),
}));

const getDispositifByIdMock = getDispositifById as jest.MockedFunction<typeof getDispositifById>;

const dispositifId = new ObjectId().toString();

const buildRequest = (): SaveTranslationRequest =>
  ({
    dispositifId,
    language: "uk",
    timeSpent: 1000,
    translated: { content: { titreInformatif: "Заголовок" } },
    toFinish: {},
    toReview: {},
  }) as unknown as SaveTranslationRequest;

const buildUser = (isExpert: boolean): User =>
  ({
    _id: new ObjectId(),
    isExpert: () => isExpert,
    isAdmin: () => false,
  }) as unknown as User;

describe("saveTranslation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getDispositifByIdMock.mockResolvedValue({
      _id: new ObjectId(dispositifId),
      translations: { fr: { content: {} }, uk: { content: {} } },
    } as any);
  });

  it("rejects with a 409 ConflictError when a non expert saves an already translated language", async () => {
    await expect(saveTranslation(buildRequest(), buildUser(false))).rejects.toThrow(ConflictError);

    await expect(saveTranslation(buildRequest(), buildUser(false))).rejects.toMatchObject({
      status: 409,
      message: "Dispositif is already translated in uk",
    });
  });

  /**
   * Les 163 fiches d'origine RCO stockent leur corps dans `content.markdown`. La clé était
   * absente de `SaveTranslationRequest`, donc `throw-on-extras` la refusait en 422 : traduire
   * la section principale de ces fiches était impossible. Ce test est typé sans cast sur
   * `translated`, pour qu'un retrait de la clé casse la compilation.
   */
  it("enregistre le corps markdown des fiches d'origine externe", async () => {
    getDispositifByIdMock.mockResolvedValue({
      _id: new ObjectId(dispositifId),
      typeContenu: "dispositif",
      translations: { fr: { content: { markdown: "# Titre\n\ntexte" } } },
    } as any);

    const request: SaveTranslationRequest = {
      dispositifId,
      language: "uk",
      timeSpent: 1000,
      toFinish: [],
      toReview: [],
      translated: {
        content: {
          titreInformatif: "Заголовок",
          markdown: "# Заголовок\n\nтекст",
        },
      },
    };

    const saved = await saveTranslation(request, buildUser(false));

    // `translated` est un Map côté mongoose (`z.record(z.any())` dans le schéma).
    const content = (saved.translated as unknown as Map<string, any>).get("content");
    expect(content.markdown).toBe("# Заголовок\n\nтекст");
    expect(content.titreInformatif).toBe("Заголовок");
  });
});
