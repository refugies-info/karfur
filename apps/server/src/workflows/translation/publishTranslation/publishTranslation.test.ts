import { ObjectId } from "@refugies-info/mongo";
import { UnauthorizedError } from "~/errors";
import * as dispositifRepository from "~/modules/dispositif/dispositif.repository";
import * as traductionsRepository from "~/modules/traductions/traductions.repository";
import * as validateTranslationModule from "../validateTranslation";
import publishTranslation from "./publishTranslation";

jest.mock("~/modules/dispositif/dispositif.repository", () => ({
  getDispositifById: jest.fn(),
  addNewParticipant: jest.fn(),
}));

jest.mock("~/modules/traductions/traductions.repository", () => ({
  getValidation: jest.fn(),
}));

jest.mock("~/modules/dispositif/dispositif.business", () => ({
  isDispositifTranslatedIn: jest.fn().mockReturnValue(false),
}));

jest.mock("../validateTranslation", () => jest.fn().mockResolvedValue(undefined));

const mockDispositifId = new ObjectId().toHexString();

const mockDispositif = {
  _id: new ObjectId(mockDispositifId),
  translations: {
    fr: {
      content: {
        titreInformatif: "Titre de test",
        abstract: "Résumé",
        what: "<p>Contenu</p>",
        how: {
          "8b4e62ab-real": { title: "Étape réelle", text: "<p>Texte</p>" },
        },
      },
    },
  },
};

const makeExpertUser = (overrides = {}) =>
  ({
    _id: new ObjectId(),
    username: "marianne",
    isExpert: () => true,
    isAdmin: () => false,
    ...overrides,
  }) as any;

const makeTraduction = (overrides: Record<string, unknown> = {}) => ({
  _id: new ObjectId(),
  userId: new ObjectId(),
  finished: true,
  toReview: [] as string[],
  translated: { content: { titreInformatif: "Тест" } },
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  (dispositifRepository.getDispositifById as jest.Mock).mockResolvedValue(mockDispositif);
  (dispositifRepository.addNewParticipant as jest.Mock).mockResolvedValue(undefined);
});

describe("publishTranslation", () => {
  describe("cas normaux", () => {
    it("publie quand finished: true et toReview vide", async () => {
      (traductionsRepository.getValidation as jest.Mock).mockResolvedValue(
        makeTraduction({ finished: true, toReview: [] }),
      );

      await expect(
        publishTranslation({ language: "uk", dispositifId: mockDispositifId }, makeExpertUser()),
      ).resolves.toBeUndefined();

      expect(validateTranslationModule.default).toHaveBeenCalledTimes(1);
    });

    it("refuse si l'utilisateur n'est pas expert", async () => {
      (traductionsRepository.getValidation as jest.Mock).mockResolvedValue(
        makeTraduction({ finished: true }),
      );

      await expect(
        publishTranslation(
          { language: "uk", dispositifId: mockDispositifId },
          makeExpertUser({ isExpert: () => false }),
        ),
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it("refuse si finished: false et toReview contient des sections FR valides", async () => {
      (traductionsRepository.getValidation as jest.Mock).mockResolvedValue(
        makeTraduction({
          finished: false,
          toReview: ["content.how.8b4e62ab-real.title", "content.how.8b4e62ab-real.text"],
        }),
      );

      await expect(
        publishTranslation({ language: "uk", dispositifId: mockDispositifId }, makeExpertUser()),
      ).rejects.toBeInstanceOf(UnauthorizedError);

      expect(validateTranslationModule.default).not.toHaveBeenCalled();
    });
  });

  describe("sections fantômes (régression migration Zod)", () => {
    it("publie quand toReview contient uniquement des sections supprimées du FR", async () => {
      // 8e981db7 et 4a4651ad n'existent plus dans mockDispositif.how
      (traductionsRepository.getValidation as jest.Mock).mockResolvedValue(
        makeTraduction({
          finished: false,
          toReview: [
            "content.how.8e981db7-deleted.title",
            "content.how.8e981db7-deleted.text",
            "content.how.4a4651ad-deleted.title",
            "content.how.4a4651ad-deleted.text",
          ],
        }),
      );

      await expect(
        publishTranslation({ language: "uk", dispositifId: mockDispositifId }, makeExpertUser()),
      ).resolves.toBeUndefined();

      expect(validateTranslationModule.default).toHaveBeenCalledTimes(1);
    });

    it("refuse si toReview mélange sections fantômes ET sections FR valides", async () => {
      (traductionsRepository.getValidation as jest.Mock).mockResolvedValue(
        makeTraduction({
          finished: false,
          toReview: [
            "content.how.8e981db7-deleted.title", // fantôme
            "content.how.8b4e62ab-real.text", // encore dans le FR !
          ],
        }),
      );

      await expect(
        publishTranslation({ language: "uk", dispositifId: mockDispositifId }, makeExpertUser()),
      ).rejects.toBeInstanceOf(UnauthorizedError);

      expect(validateTranslationModule.default).not.toHaveBeenCalled();
    });
  });

  describe("cas limites", () => {
    it("refuse si aucun doc de traduction trouvé (getValidation retourne null)", async () => {
      (traductionsRepository.getValidation as jest.Mock).mockResolvedValue(null);

      await expect(
        publishTranslation({ language: "uk", dispositifId: mockDispositifId }, makeExpertUser()),
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });
  });
});
