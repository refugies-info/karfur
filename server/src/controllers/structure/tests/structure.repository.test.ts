// @ts-nocheck
import { Structure } from "../../../schema/schemaStructure";
import {
  getStructureFromDB,
  getStructuresFromDB,
  updateAssociatedDispositifsInStructure,
} from "../structure.repository";

describe("getStructureFromDB", () => {
  it("should call Structure with populate if param is true", async () => {
    Structure.findOne = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue("structuresWithDispos"),
    });

    const res = await getStructureFromDB("id", true, "all");
    expect(Structure.findOne).toHaveBeenCalledWith({ _id: "id" });
    expect(res).toEqual("structuresWithDispos");
  });

  it("should call Structure without populate if param is false", async () => {
    Structure.findOne = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue("structuresWithDispos"),
    });

    const res = await getStructureFromDB("id", false, "all");
    expect(res).not.toEqual("structuresWithDispos");
  });

  it("should call Structure without populate if param is false", async () => {
    Structure.findOne = jest.fn().mockReturnValue("structuresWithoutDispos");

    const res = await getStructureFromDB("id", false, "all");
    expect(res).toEqual("structuresWithoutDispos");
  });
});

describe("getStructuresFromDB", () => {
  it("should call structure.find", async () => {
    Structure.find = jest.fn().mockResolvedValue({});

    await getStructuresFromDB();
    expect(Structure.find).toHaveBeenCalledWith(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1 }
    );
  });
});

describe("updateAssociatedDispositifsInStructure", () => {
  it("should call Structure.findByIdAndUpdate and Structure.find which returns one structure", async () => {
    Structure.findByIdAndUpdate = jest.fn();
    Structure.find = jest.fn().mockResolvedValue([{ _id: "id1" }]);

    await updateAssociatedDispositifsInStructure("dispositifId", "sponsorId");
    expect(Structure.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: "sponsorId" },
      { $addToSet: { dispositifsAssocies: "dispositifId" } },
      // @ts-ignore
      { new: true }
    );

    expect(Structure.find).toHaveBeenCalledWith({
      dispositifsAssocies: "dispositifId",
    });
  });

  it("should call Structure.findByIdAndUpdate and Structure.find which returns 2 structures", async () => {
    Structure.findByIdAndUpdate = jest.fn();
    Structure.find = jest
      .fn()
      .mockResolvedValue([
        { _id: "id1" },
        { _id: "id2" },
        { _id: "sponsorId" },
      ]);

    await updateAssociatedDispositifsInStructure("dispositifId", "sponsorId");
    expect(Structure.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: "sponsorId" },
      { $addToSet: { dispositifsAssocies: "dispositifId" } },
      // @ts-ignore
      { new: true }
    );

    expect(Structure.find).toHaveBeenCalledWith({
      dispositifsAssocies: "dispositifId",
    });

    expect(Structure.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: "id1" },
      { $pull: { dispositifsAssocies: "dispositifId" } },
      // @ts-ignore
      { new: true }
    );
    expect(Structure.findByIdAndUpdate).toHaveBeenCalledWith(
      { _id: "id2" },
      { $pull: { dispositifsAssocies: "dispositifId" } },
      // @ts-ignore
      { new: true }
    );
    expect(Structure.findByIdAndUpdate).not.toHaveBeenCalledWith(
      { _id: "sponsorId" },
      { $pull: { dispositifsAssocies: "dispositifId" } },
      // @ts-ignore
      { new: true }
    );
  });
});
