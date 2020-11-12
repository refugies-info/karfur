// @ts-nocheck
import Structure from "../../../schema/schemaStructure.js";
import { getStructureFromDB } from "../structure.repository";

describe("getStructureFromDB", () => {
  it("should call Structure with populate if param is true", async () => {
    Structure.findOne = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue("structuresWithDispos"),
    });

    const res = await getStructureFromDB("id", true);
    expect(res).toEqual("structuresWithDispos");
  });

  it("should call Structure without populate if param is false", async () => {
    Structure.findOne = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue("structuresWithDispos"),
    });

    const res = await getStructureFromDB("id", false);
    expect(res).not.toEqual("structuresWithDispos");
  });

  it("should call Structure without populate if param is false", async () => {
    Structure.findOne = jest.fn().mockReturnValue("structuresWithoutDispos");

    const res = await getStructureFromDB("id", false);
    expect(res).toEqual("structuresWithoutDispos");
  });
});
