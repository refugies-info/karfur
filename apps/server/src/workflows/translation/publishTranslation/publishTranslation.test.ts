import {
  DispositifModel,
  DispositifStatus,
  TraductionsModel,
  TraductionsType,
  UserModel,
} from "@refugies-info/mongo";
import { cloneDeep } from "lodash";
import { UnauthorizedError } from "~/errors";
import { fixtures } from "../../../__fixtures__";
import validateTranslation from "../validateTranslation";
import publishTranslation from "./publishTranslation";

jest.mock("../validateTranslation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedValidateTranslation = validateTranslation as jest.Mock;

/**
 * RI-1507 — publication used to rely on the stored `finished` flag, which could
 * predate the current french content: removing a block from the FR dispositif
 * persisted `finished: false` for good, so translations the UI displayed as
 * complete stayed impossible to publish, with the 401 swallowed by the front.
 * `finished` is now recomputed at publication time.
 */
describe("publishTranslation (RI-1507)", () => {
  /**
   * `roles` is an array of refs, so assigning populated roles to a UserModel
   * instance does not survive mongoose casting and `isExpert()` would be false.
   * publishTranslation only needs _id / username / isExpert / isAdmin.
   */
  const expert = {
    _id: fixtures.user._id,
    username: "expert-trad",
    isExpert: () => true,
    isAdmin: () => false,
  };

  beforeEach(async () => {
    await DispositifModel.deleteMany({});
    await TraductionsModel.deleteMany({});
    await UserModel.deleteMany({});
    mockedValidateTranslation.mockClear();
  });

  const createDispositifWithTranslation = async (overrides: Record<string, unknown> = {}) => {
    const dispositif = await DispositifModel.create({
      ...fixtures.dispositif,
      status: DispositifStatus.ACTIVE,
      translations: { fr: cloneDeep(fixtures.dispositif.translations.fr) },
      creatorId: expert._id,
    });

    await TraductionsModel.create({
      dispositifId: dispositif._id,
      userId: expert._id,
      language: "en",
      type: TraductionsType.VALIDATION,
      // fully translated: same content as the french version
      translated: cloneDeep(dispositif.translations.fr),
      toReview: [],
      toFinish: [],
      timeSpent: 0,
      ...overrides,
    });

    return dispositif;
  };

  it("publishes a complete translation even when the stored `finished` flag is stale", async () => {
    const dispositif = await createDispositifWithTranslation({ finished: false });

    await publishTranslation(
      { language: "en", dispositifId: dispositif._id.toString() },
      expert as any,
    );

    expect(mockedValidateTranslation).toHaveBeenCalledTimes(1);
  });

  it("refuses a translation that is genuinely incomplete", async () => {
    const dispositif = await createDispositifWithTranslation({
      finished: true, // stored flag says ready, the content says otherwise
      translated: { content: { titreInformatif: "only a title" } },
    });

    await expect(
      publishTranslation(
        { language: "en", dispositifId: dispositif._id.toString() },
        expert as any,
      ),
    ).rejects.toThrow(UnauthorizedError);
    expect(mockedValidateTranslation).not.toHaveBeenCalled();
  });

  it("answers an explicit error instead of crashing when the publisher has no validation", async () => {
    const dispositif = await DispositifModel.create({
      ...fixtures.dispositif,
      status: DispositifStatus.ACTIVE,
      translations: { fr: cloneDeep(fixtures.dispositif.translations.fr) },
      creatorId: expert._id,
    });

    // no traduction at all for this language: used to throw
    // "Cannot read properties of null (reading 'finished')" and answer a 500
    await expect(
      publishTranslation(
        { language: "en", dispositifId: dispositif._id.toString() },
        expert as any,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });
});
