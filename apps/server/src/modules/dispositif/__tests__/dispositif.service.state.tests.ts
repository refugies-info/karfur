import { DispositifStatus } from "@refugies-info/api-types";
import { type Dispositif, DispositifModel, SnapshotModel } from "~/typegoose"; // Assuming models are available
import { fixtures } from "../../../__fixtures__";
import { saveAndOverwriteDraft } from "../dispositif.service";

describe("saveAndOverwriteDraft - Narrow Integration Tests", () => {
  beforeEach(async () => {
    // Clear relevant collections before each test
    await DispositifModel.deleteMany({});
    await SnapshotModel.deleteMany({});
  });

  it("should create a snapshot when status changes from WAITING_ADMIN to ACTIVE", async () => {
    // 1. Setup: Create initial dispositif in DB
    const initialDispositif = await DispositifModel.create({
      ...fixtures.dispositif,
      status: DispositifStatus.WAITING_ADMIN,
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
    expect(snapshot.from).toBe(DispositifStatus.WAITING_ADMIN);
    expect(snapshot.to).toBe(DispositifStatus.ACTIVE);
  });

  it("should NOT create a snapshot when status does not change from WAITING_ADMIN to ACTIVE", async () => {
    // 1. Setup: Create initial dispositif (e.g., ACTIVE)
    const initialDispositif = await DispositifModel.create({
      ...fixtures.dispositif,
      status: DispositifStatus.ACTIVE,
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

  it("should not take a snapshot on a demarche", async () => {
    // 1. Setup: Create initial demarche
    const initialDemarche = await DispositifModel.create({
      ...fixtures.demarche,
      status: DispositifStatus.ACTIVE,
    });
    const demarcheId = initialDemarche._id;

    // 2. Execute: Call the service function with data to update status
    const updateData: Partial<Dispositif> = {
      status: DispositifStatus.ACTIVE,
    };
    const { updatedDispositif } = await saveAndOverwriteDraft(demarcheId, updateData);

    // 3. Verify
    // Check demarche update
    expect(updatedDispositif.status).toBe(DispositifStatus.ACTIVE);
    expect(updatedDispositif.hasDraftVersion).toBe(false);

    const dbDemarche = await DispositifModel.findById(demarcheId).lean();
    expect(dbDemarche?.status).toBe(DispositifStatus.ACTIVE);
    expect(dbDemarche?.hasDraftVersion).toBe(false);

    // Check NO snapshot was created for this operation
    const snapshots = await SnapshotModel.find({ demarcheId }).lean();
    expect(snapshots).toHaveLength(0); // Key assertion: no snapshot created
  });
});
