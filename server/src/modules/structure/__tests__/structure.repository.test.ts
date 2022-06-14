// @ts-nocheck
import { Structure } from "../../../schema/schemaStructure";
import {
  getStructureFromDB,
  getStructuresFromDB,
  updateAssociatedDispositifsInStructure,
} from "../structure.repository";


jest.mock("../../../schema/schemaStructure", () => ({
  Structure: {
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  }
}));


describe("getStructureFromDB", () => {
  it("should call Structure with populate if param is true", async () => {
    Structure.findOne.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue("structuresWithDispos"),
    });

    const res = await getStructureFromDB("id", true, "all");
    expect(Structure.findOne).toHaveBeenCalledWith({ _id: "id" });
    expect(res).toEqual("structuresWithDispos");
  });

  it("should call Structure without populate if param is false", async () => {
    Structure.findOne.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue("structuresWithDispos"),
    });

    const res = await getStructureFromDB("id", false, "all");
    expect(res).not.toEqual("structuresWithDispos");
  });

  it("should call Structure without populate if param is false", async () => {
    Structure.findOne.mockReturnValueOnce("structuresWithoutDispos");

    const res = await getStructureFromDB("id", false, "all");
    expect(res).toEqual("structuresWithoutDispos");
  });
});

describe("getStructuresFromDB", () => {
  it("should call structure.find when withDispositifsAssocies false ", async () => {
    Structure.find.mockResolvedValueOnce({});

    const query = { status: "Actif" };
    const fields = { nom: 1, acronyme: 1, picture: 1 };
    await getStructuresFromDB(query, fields, false);
    expect(Structure.find).toHaveBeenCalledWith(query, fields);
  });

  it("should call structure.find when withDispositifsAssocies true ", async () => {
    Structure.find.mockReturnValueOnce({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(["structuresWithDispos"])
      })
    });

    const query = { status: "Actif" };
    const fields = { nom: 1, acronyme: 1, picture: 1 };
    const res = await getStructuresFromDB(query, fields, true);
    expect(Structure.find).toHaveBeenCalledWith(query, fields);
    expect(res).toEqual(["structuresWithDispos"]);
  });
});

describe("updateAssociatedDispositifsInStructure", () => {
  it("should call Structure.findByIdAndUpdate and Structure.find which returns one structure", async () => {
    Structure.find.mockResolvedValueOnce([{ _id: "id1" }]);

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
    Structure.find.mockResolvedValueOnce([
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
