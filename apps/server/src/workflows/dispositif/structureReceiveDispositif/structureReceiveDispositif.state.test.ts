import { DispositifStatus } from "@refugies-info/api-types";
import { DispositifModel, SnapshotModel, StructureModel, UserModel } from "~/typegoose";
import { fixtures } from "../../../__fixtures__";
import { structureReceiveDispositif } from "./structureReceiveDispositif";

describe("structureReceiveDispositif", () => {
  beforeEach(async () => {
    // Clear relevant collections before each test
    await DispositifModel.deleteMany({});
    await SnapshotModel.deleteMany({});
    await StructureModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  it("should take a snapshot when status changes to WAITING_ADMIN", async () => {
    // 1. Setup initial state
    const dispositif = await DispositifModel.create({
      ...fixtures.dispositif,
      status: DispositifStatus.WAITING_STRUCTURE,
    });
    await StructureModel.create(fixtures.structure.toObject());
    await UserModel.create(fixtures.user.toObject());

    // 2. Execute function
    await structureReceiveDispositif(dispositif._id.toString(), { accept: true }, fixtures.user);

    // 3. Verify resulting state
    const updatedDispositif = await DispositifModel.findById(dispositif._id).lean();
    expect(updatedDispositif.status).toBe(DispositifStatus.WAITING_ADMIN);

    // Verify snapshot was taken
    const snapshots = await SnapshotModel.find({
      dispositifId: dispositif._id,
      type: "before",
    });
    expect(snapshots.length).toBe(1);
    expect(snapshots[0].from).toBe(DispositifStatus.WAITING_STRUCTURE);
    expect(snapshots[0].to).toBe(DispositifStatus.WAITING_ADMIN);
  });

  it("should not take a snapshot on a demarche", async () => {
    // 1. Setup initial state
    const dispositif = await DispositifModel.create({
      ...fixtures.demarche,
      status: DispositifStatus.WAITING_STRUCTURE,
    });
    await StructureModel.create(fixtures.structure.toObject());
    await UserModel.create(fixtures.user.toObject());

    // 2. Execute function
    await structureReceiveDispositif(dispositif._id.toString(), { accept: true }, fixtures.user);

    // 3. Verify resulting state
    const updatedDispositif = await DispositifModel.findById(dispositif._id).lean();
    expect(updatedDispositif.status).toBe(DispositifStatus.WAITING_ADMIN);

    // Verify snapshot was not taken
    const snapshots = await SnapshotModel.find({
      dispositifId: dispositif._id,
      type: "before",
    });
    expect(snapshots.length).toBe(0);
  });
});
