import { DispositifStatus } from "@refugies-info/api-types";
import {
  DispositifDraftModel,
  DispositifModel,
  SnapshotModel,
  StructureModel,
  TraductionsModel,
  TraductionsType,
  UserModel,
} from "@refugies-info/mongo";
import { cloneDeep } from "lodash";
import { fixtures } from "../../../__fixtures__";
import { computeTraductionFinished } from "../../../modules/traductions/traductions.business";
import { publishDispositif } from "../publishDispositif";

jest.mock("~/connectors/slack/sendSlackNotif", () => ({
  sendSlackNotif: jest.fn(),
  slackDeletedAccount: jest.fn(),
}));

/**
 * RI-1507 — removing a block from the french content used to leave every
 * translation of that dispositif permanently unpublishable:
 *  - `finished` was recomputed against the *previous* french version, which
 *    still contained the removed block, so it was persisted as false;
 *  - `toReview` could keep entries pointing at paths that no longer exist.
 * In both cases the front recomputed 100% from the current french content and
 * offered to publish, while the server answered 401 forever.
 */
describe("publishDispositif - translations progress (RI-1507)", () => {
  beforeEach(async () => {
    await DispositifModel.deleteMany({});
    await DispositifDraftModel.deleteMany({});
    await SnapshotModel.deleteMany({});
    await StructureModel.deleteMany({});
    await TraductionsModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  const setup = async () => {
    await UserModel.create(fixtures.user.toObject());
    await StructureModel.create(fixtures.structure.toObject());

    const dispositif = await DispositifModel.create({
      ...fixtures.dispositif,
      status: DispositifStatus.ACTIVE,
      hasDraftVersion: true,
      creatorId: fixtures.user._id,
    });

    const frContent = cloneDeep(dispositif.translations.fr.content) as any;

    // fully translated english validation, nothing left to review
    const traduction: any = {
      dispositifId: dispositif._id,
      userId: fixtures.user._id,
      language: "en",
      type: TraductionsType.VALIDATION,
      translated: { content: cloneDeep(frContent) },
      toReview: [],
      toReviewCache: [],
      toFinish: [],
      timeSpent: 0,
    };
    traduction.finished = computeTraductionFinished(dispositif as any, traduction);
    expect(traduction.finished).toBe(true);
    await TraductionsModel.create(traduction);

    return { dispositif, frContent };
  };

  it("keeps a completed translation publishable after a french block is removed", async () => {
    const { dispositif, frContent } = await setup();

    // the draft drops one "why" block from the french content
    const draft = (await DispositifModel.findById(dispositif._id).lean()) as any;
    const removedBlockId = Object.keys(frContent.why)[0];
    delete draft.translations.fr.content.why[removedBlockId];
    draft.status = DispositifStatus.ACTIVE;
    await DispositifDraftModel.create(draft);

    await publishDispositif(dispositif._id.toString(), { keepTranslations: false }, fixtures.user);

    const updated = await TraductionsModel.findOne({
      dispositifId: dispositif._id,
      language: "en",
    }).lean();

    // the removed block is gone from the translation too, so nothing is missing
    expect((updated as any).translated.content.why[removedBlockId]).toBeUndefined();
    // ...and the translation must stay publishable
    expect(updated?.finished).toBe(true);
  });

  it("ignores toReview entries pointing at sections absent from the french content", async () => {
    const { dispositif } = await setup();

    const traduction = (await TraductionsModel.findOne({
      dispositifId: dispositif._id,
    }).lean()) as any;

    const ghost = "content.why.00000000-0000-0000-0000-000000000000";
    const withGhosts = {
      ...traduction,
      toReview: [`${ghost}.title`, `${ghost}.text`],
    };

    expect(computeTraductionFinished(dispositif as any, withGhosts)).toBe(true);
  });
});
