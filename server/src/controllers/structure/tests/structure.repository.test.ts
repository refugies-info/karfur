// @ts-nocheck
import { Structure } from "../../../schema/schemaStructure";
import {
  getStructureFromDB,
  getStructuresFromDB,
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
