import { DispositifStatus } from "@refugies-info/api-types";
import { Types } from "mongoose";
import { Dispositif, DispositifModel, SnapshotModel } from "~/typegoose"; // Assuming models are available
import { dispositif as baseDispositif } from "../../../__fixtures__";
import { saveAndOverwriteDraft } from "../dispositif.service";

// Helper function to create a basic dispositif for testing
const createTestDispositif = async (initialData: Partial<Dispositif>): Promise<Dispositif> => {
  const data = {
    ...baseDispositif, // Start with fixture defaults
    _id: new Types.ObjectId(), // Generate a unique ID
    status: DispositifStatus.DRAFT, // Default status unless overridden
    hasDraftVersion: false,
    ...initialData, // Apply specific test data
  };
  // Remove potential conflicting fields from fixture if providing new ones
  if (initialData.mainSponsor) delete data.mainSponsor;
  if (initialData.sponsors) delete data.sponsors;

  return DispositifModel.create(data);
};

describe("saveAndOverwriteDraft - Narrow Integration Tests", () => {
  beforeEach(async () => {
    // Clear relevant collections before each test
    await DispositifModel.deleteMany({});
    await SnapshotModel.deleteMany({});
    // Add DraftDispositifModel.deleteMany({}) if applicable
  });

  it("should create a snapshot when status changes from WAITING_ADMIN to ACTIVE", async () => {
    // 1. Setup: Create initial dispositif in DB
    const initialStatus = DispositifStatus.WAITING_ADMIN;
    const initialDispositif = await createTestDispositif({
      status: initialStatus,
    });
    const dispositifId = initialDispositif._id;

    // 2. Execute: Call the service function with data to update status
    const updateData: Partial<Dispositif> = {
      status: DispositifStatus.ACTIVE,
    };
    const { updatedDispositif } = await saveAndOverwriteDraft(dispositifId, updateData);

    // 3. Verify: Check database state
    // Check dispositif update
    expect(updatedDispositif._id).toEqual(dispositifId);
    expect(updatedDispositif.status).toBe(DispositifStatus.ACTIVE);
    expect(updatedDispositif.hasDraftVersion).toBe(false);

    const dbDispositif = await DispositifModel.findById(dispositifId).lean();
    expect(dbDispositif).not.toBeNull();
    expect(dbDispositif?.status).toBe(DispositifStatus.ACTIVE);
    expect(dbDispositif?.hasDraftVersion).toBe(false);

    // Check snapshot creation
    const snapshots = await SnapshotModel.find({ dispositifId }).lean();
    expect(snapshots).toHaveLength(1);
    const snapshot = snapshots[0];
    expect(snapshot.type).toBe("after");
    expect(snapshot.from).toBe(initialStatus);
    expect(snapshot.to).toBe(DispositifStatus.ACTIVE);
  });

  it("should NOT create a snapshot when status does not change from WAITING_ADMIN to ACTIVE", async () => {
    // 1. Setup: Create initial dispositif (e.g., ACTIVE)
    const initialStatus = DispositifStatus.ACTIVE;
    const initialDispositif = await createTestDispositif({
      status: initialStatus,
    });
    const dispositifId = initialDispositif._id;

    // 2. Execute: Update without the specific status transition
    const updateData: Partial<Dispositif> = {
      status: DispositifStatus.ACTIVE, // Stays ACTIVE
    };
    const { updatedDispositif } = await saveAndOverwriteDraft(dispositifId, updateData);

    // 3. Verify
    // Check dispositif update
    expect(updatedDispositif.status).toBe(DispositifStatus.ACTIVE);
    expect(updatedDispositif.hasDraftVersion).toBe(false);

    const dbDispositif = await DispositifModel.findById(dispositifId).lean();
    expect(dbDispositif?.status).toBe(DispositifStatus.ACTIVE);
    expect(dbDispositif?.hasDraftVersion).toBe(false);

    // Check NO snapshot was created for this operation
    const snapshots = await SnapshotModel.find({ dispositifId }).lean();
    expect(snapshots).toHaveLength(0); // Key assertion: no snapshot created
  });

  // Add more tests here for draft handling scenarios, e.g.:
  // - Test that draft properties are copied correctly
  // - Test that the draft document is deleted
  // - Test snapshot creation/non-creation in scenarios involving drafts
});
