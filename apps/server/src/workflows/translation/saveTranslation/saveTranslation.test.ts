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
});
