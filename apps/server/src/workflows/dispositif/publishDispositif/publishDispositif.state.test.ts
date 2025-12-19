import { DispositifStatus, type PublishDispositifRequest } from "@refugies-info/api-types";
import {
  DispositifDraftModel,
  DispositifModel,
  SnapshotModel,
  StructureModel,
  UserModel,
} from "~/typegoose";
import { fixtures } from "../../../__fixtures__";
import { publishDispositif } from "../publishDispositif";

describe("publishDispositif - Narrow Integration Tests", () => {
  beforeEach(async () => {
    // Clear relevant collections before each test
    await DispositifModel.deleteMany({});
    await DispositifDraftModel.deleteMany({});
    await SnapshotModel.deleteMany({});
    await StructureModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  it("should create a 'before' snapshot when status changes from ACTIVE to UPDATE_TO_VALIDATE", async () => {
    // Create a real user in the database for the workflow
    await UserModel.create(fixtures.user);

    // Create structure fixture
    await StructureModel.create(fixtures.structure);

    // 1. Setup: Create initial ACTIVE dispositif in DB
    const dispositif = await DispositifModel.create({
      ...fixtures.dispositif,
      status: DispositifStatus.ACTIVE,
      hasDraftVersion: true, // Simulate an existing draft being published
      creatorId: fixtures.user._id,
    });
    const dispositifId = dispositif._id;

    // Create a dummy draft version (publishDispositif expects it)
    const draftData = await DispositifModel.findById(dispositifId).lean();
    draftData.translations.fr.content.abstract = `Mise à jour du ${draftData.translations.fr.content.abstract}`;
    await DispositifDraftModel.create(draftData);

    // Create an empty body for the request
    const mockBody: PublishDispositifRequest = { keepTranslations: false };

    // 2. Execute: Call the workflow function
    // publishDispositif doesn't return the updated object, just a status
    await publishDispositif(dispositifId.toString(), mockBody, fixtures.user);

    // 3. Verify: Check database state
    // Fetch the draft again after the update
    const draftDispositifAfterUpdate = await DispositifDraftModel.findById(dispositifId).lean();

    // Check draft after update
    expect(draftDispositifAfterUpdate).not.toBeNull();
    expect(draftDispositifAfterUpdate?._id).toEqual(dispositifId);
    expect(draftDispositifAfterUpdate?.status).toBe(DispositifStatus.UPDATE_TO_VALIDATE);
    expect(draftDispositifAfterUpdate?.hasDraftVersion).toBe(true);

    // Check snapshot creation
    const snapshots = await SnapshotModel.find({ dispositifId }).lean();
    expect(snapshots).toHaveLength(1);
    const snapshot = snapshots[0];
    expect(snapshot.type).toBe("before"); // Verify snapshot type
    expect(snapshot.from).toBe(DispositifStatus.ACTIVE); // Verify 'from' status
    expect(snapshot.to).toBe(DispositifStatus.UPDATE_TO_VALIDATE); // Verify 'to' status
  });

  it("should not take a snapshot on a demarche", async () => {
    // Create a real user in the database for the workflow
    await UserModel.create(fixtures.user);

    // Create structure fixture
    await StructureModel.create(fixtures.structure);

    // 1. Setup initial state
    const dispositif = await DispositifModel.create({
      ...fixtures.demarche,
      status: DispositifStatus.ACTIVE,
      hasDraftVersion: true, // Simulate an existing draft being published
      creatorId: fixtures.user._id,
    });
    const dispositifId = dispositif._id;

    // Create a dummy draft version (publishDispositif expects it)
    const draftData = await DispositifModel.findById(dispositifId).lean();
    draftData.translations.fr.content.abstract = `Mise à jour du ${draftData.translations.fr.content.abstract}`;
    await DispositifDraftModel.create(draftData);

    // Create an empty body for the request
    const mockBody: PublishDispositifRequest = { keepTranslations: false };

    // 2. Execute: Call the workflow function
    // publishDispositif doesn't return the updated object, just a status
    await publishDispositif(dispositifId.toString(), mockBody, fixtures.user);

    // 3. Verify: Check database state
    // Fetch the draft again after the update
    const draftDispositifAfterUpdate = await DispositifDraftModel.findById(dispositifId).lean();

    // Check draft after update
    expect(draftDispositifAfterUpdate).not.toBeNull();
    expect(draftDispositifAfterUpdate?._id).toEqual(dispositifId);
    expect(draftDispositifAfterUpdate?.status).toBe(DispositifStatus.UPDATE_TO_VALIDATE);
    expect(draftDispositifAfterUpdate?.hasDraftVersion).toBe(true);

    // Check snapshot creation
    const snapshots = await SnapshotModel.find({ dispositifId }).lean();
    expect(snapshots).toHaveLength(0);
  });
});
