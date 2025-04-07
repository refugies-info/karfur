import { Dispositif, ObjectId, SnapshotModel } from "~/typegoose";
import { takeSnapshot } from "../snapshots.service";

describe("takeSnapshot", () => {
  beforeEach(async () => {
    await SnapshotModel.deleteMany({});
  });

  it("should create first snapshot with version 1 when no snapshots exist", async () => {
    const mockDispositif = {
      _id: new ObjectId(),
      translations: { fr: { content: "test content" } },
    } as unknown as Dispositif;

    const result = await takeSnapshot(mockDispositif, "before", "from", "to");

    expect(result?.version).toBe(1);

    // Verify in database directly
    const snapshots = await SnapshotModel.find({});
    expect(snapshots).toHaveLength(1);
    expect(snapshots[0].version).toBe(1);
  });

  it("should increment version when snapshots exist", async () => {
    // First create a snapshot with version 1
    const mockDispositif = {
      _id: new ObjectId(),
      translations: { fr: { content: "test content" } },
    } as unknown as Dispositif;

    await takeSnapshot(mockDispositif, "before", "from", "to");

    // Now take another snapshot
    const result = await takeSnapshot(mockDispositif, "after", "from2", "to2");

    expect(result?.version).toBe(2);

    // Verify in database directly
    const snapshots = await SnapshotModel.find({});
    expect(snapshots).toHaveLength(2);
    // Ensure they are sorted by version to check the latest one
    snapshots.sort((a, b) => a.version - b.version);
    expect(snapshots[1].version).toBe(2);
  });
});
