import { DispositifStatus } from "@refugies-info/api-types";
import { DispositifModel, SnapshotModel } from "@refugies-info/mongo";
import { fixtures } from "~/__fixtures__";
import { takeSnapshot } from "../snapshots.service";

describe("takeSnapshot", () => {
  beforeEach(async () => {
    await DispositifModel.deleteMany({});
    await SnapshotModel.deleteMany({});
  });

  it("should create first snapshot with version 1 when no snapshots exist", async () => {
    const dispositif = await DispositifModel.create({
      ...fixtures.dispositif,
      status: DispositifStatus.DRAFT,
      hasDraftVersion: false,
      translations: { fr: { content: "test content" } },
    });

    const result = await takeSnapshot(
      dispositif,
      "before",
      DispositifStatus.DRAFT,
      DispositifStatus.ACTIVE,
    );

    expect(result?.version).toBe(1);

    // Verify in database directly
    const snapshots = await SnapshotModel.find({});
    expect(snapshots).toHaveLength(1);
    const snapshot = snapshots[0];
    expect(snapshot.version).toBe(1);
    expect(snapshot.type).toBe("before");
    expect(snapshot.from).toBe(DispositifStatus.DRAFT);
    expect(snapshot.to).toBe(DispositifStatus.ACTIVE);
  });

  it("should increment version when snapshots exist", async () => {
    // First create a snapshot with version 1
    const dispositif = await DispositifModel.create({
      ...fixtures.dispositif,
      status: DispositifStatus.DRAFT,
      hasDraftVersion: false,
      translations: { fr: { content: "test content" } },
    });

    await takeSnapshot(dispositif, "before", DispositifStatus.DRAFT, DispositifStatus.ACTIVE);

    // Now take another snapshot
    const result = await takeSnapshot(
      dispositif,
      "after",
      DispositifStatus.DRAFT,
      DispositifStatus.ACTIVE,
    );

    expect(result?.version).toBe(2);

    // Verify in database directly
    const snapshots = await SnapshotModel.find({});
    expect(snapshots).toHaveLength(2);
    // Ensure they are sorted by version to check the latest one
    snapshots.sort((a, b) => a.version - b.version);
    expect(snapshots[1].version).toBe(2);
    expect(snapshots[1].type).toBe("after");
    expect(snapshots[1].from).toBe(DispositifStatus.DRAFT);
    expect(snapshots[1].to).toBe(DispositifStatus.ACTIVE);
  });
});
