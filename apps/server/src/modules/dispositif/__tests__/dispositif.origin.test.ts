import { ContentType, DispositifStatus, RoleName } from "@refugies-info/api-types";
import { fixtures } from "~/__fixtures__";
import { getDispositifById } from "~/modules/dispositif/dispositif.repository";
import { DispositifModel, RoleModel, UserModel } from "~/typegoose";
import { createDispositif } from "~/workflows/dispositif/createDispositif/createDispositif";
import { updateDispositif } from "~/workflows/dispositif/updateDispositif/updateDispositif";

describe("Dispositif Origin", () => {
  beforeEach(async () => {
    await DispositifModel.deleteMany({});
    await UserModel.deleteMany({});
    await RoleModel.deleteMany({});
    await RoleModel.create({ nom: RoleName.CONTRIB });
  });

  it("should set default origin to RI on creation", async () => {
    const user = await UserModel.create(fixtures.user);
    const result = await createDispositif(
      {
        typeContenu: ContentType.DISPOSITIF,
        titreInformatif: "Test Dispositif",
      },
      user._id,
    );

    expect(result.data.origin).toBe("RI");

    const dispositif = await DispositifModel.findById(result.data.id);
    expect(dispositif?.origin).toBe("RI");
  });

  it("should set origin to RCO on creation if specified", async () => {
    const user = await UserModel.create(fixtures.user);
    const result = await createDispositif(
      {
        typeContenu: ContentType.DISPOSITIF,
        titreInformatif: "Test Dispositif RCO",
        origin: "RCO",
      },
      user._id,
    );

    expect(result.data.origin).toBe("RCO");

    const dispositif = await DispositifModel.findById(result.data.id);
    expect(dispositif?.origin).toBe("RCO");
  });

  it("should return origin in updateDispositif response", async () => {
    const user = await UserModel.create(fixtures.user);
    const createResult = await createDispositif(
      {
        typeContenu: ContentType.DISPOSITIF,
        titreInformatif: "Test Dispositif",
      },
      user._id,
    );

    const updateResult = await updateDispositif(
      createResult.data.id.toString(),
      {
        titreInformatif: "Updated Title",
      },
      user,
    );

    expect(updateResult.data.origin).toBe("RI");
  });

  it("should not allow updating origin", async () => {
    const user = await UserModel.create(fixtures.user);
    const createResult = await createDispositif(
      {
        typeContenu: ContentType.DISPOSITIF,
        titreInformatif: "Test Dispositif",
        origin: "RI",
      },
      user._id,
    );

    await updateDispositif(
      createResult.data.id.toString(),
      {
        origin: "RCO",
      },
      user,
    );

    const dispositif = await DispositifModel.findById(createResult.data.id);
    expect(dispositif?.origin).toBe("RI");
  });

  it("should default missing origin to RI in API responses", async () => {
    const user = await UserModel.create(fixtures.user);
    // Create a raw document without origin (simulating legacy data)
    const dispositif = await DispositifModel.create({
      typeContenu: ContentType.DISPOSITIF,
      titreInformatif: "Legacy Dispositif",
      creatorId: user._id,
      status: DispositifStatus.DRAFT,
    });

    // Manually unset origin to simulate legacy data
    await DispositifModel.updateOne({ _id: dispositif._id }, { $unset: { origin: "" } });

    // Test that serialization defaults missing origin to "RI"

    const foundDispositif = await getDispositifById(dispositif._id.toString());

    // The origin should default to "RI" in the serialization
    expect(foundDispositif?.origin).toBe("RI");
  });
});
