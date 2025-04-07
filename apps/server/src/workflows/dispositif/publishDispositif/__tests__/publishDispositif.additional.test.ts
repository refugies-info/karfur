import { DispositifStatus, PublishDispositifRequest } from "@refugies-info/api-types";
import {
  Dispositif,
  DispositifDraftModel,
  DispositifModel,
  ObjectId,
  SnapshotModel,
  StructureModel,
  UserModel,
} from "~/typegoose";
import { dispositif as baseDispositif, structure, user } from "../../../../__fixtures__";
import { publishDispositif } from "../publishDispositif";

// Helper function to create a basic dispositif for testing
const createTestDispositif = async (initialData: Partial<Dispositif>): Promise<Dispositif> => {
  const data = {
    ...baseDispositif, // Start with fixture defaults
    _id: new ObjectId(), // Generate a unique ID
    status: DispositifStatus.DRAFT, // Default status unless overridden
    hasDraftVersion: false,
    ...initialData, // Apply specific test data
  };

  return DispositifModel.create(data);
};

describe("publishDispositif - Narrow Integration Tests", () => {
  beforeEach(async () => {
    // Clear relevant collections before each test
    await DispositifModel.deleteMany({});
    await DispositifDraftModel.deleteMany({});
    await SnapshotModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  it("should create a 'before' snapshot when status changes from ACTIVE to UPDATE_TO_VALIDATE", async () => {
    // Create a real user in the database for the workflow
    await UserModel.create(user);

    // Create structure fixture
    await StructureModel.create(structure);

    // 1. Setup: Create initial ACTIVE dispositif in DB
    const initialStatus = DispositifStatus.ACTIVE;
    const initialDispositif = await createTestDispositif({
      status: initialStatus,
      hasDraftVersion: true, // Simulate an existing draft being published
      creatorId: user._id,
    });
    const dispositifId = initialDispositif._id;

    // Create a dummy draft version (publishDispositif expects it)
    const draftData = await DispositifModel.findById(dispositifId).lean();
    draftData.translations.fr.content.abstract = `Mise à jour du ${draftData.translations.fr.content.abstract}`;
    await DispositifDraftModel.create(draftData);

    // Create an empty body for the request
    const mockBody: PublishDispositifRequest = { keepTranslations: false };

    // 2. Execute: Call the workflow function
    // publishDispositif doesn't return the updated object, just a status
    await publishDispositif(dispositifId.toString(), mockBody, user);

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
    expect(snapshot.from).toBe(initialStatus); // Verify 'from' status
    expect(snapshot.to).toBe(DispositifStatus.UPDATE_TO_VALIDATE); // Verify 'to' status
  });

  // Add more tests here for other scenarios if needed
});
