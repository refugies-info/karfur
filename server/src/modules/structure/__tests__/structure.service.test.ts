// @ts-nocheck
import { getStructureFromDB } from "../structure.repository";
import {
  checkIfUserIsAuthorizedToModifyStructure,
  getStructureMembers,
} from "../structure.service";

jest.mock("../structure.repository", () => ({
  getStructureFromDB: jest.fn(),
}));

describe("updateStructure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw NO_STRUCTURE_WITH_THIS_ID when no structure", async () => {
    getStructureFromDB.mockResolvedValueOnce(null);

    try {
      await checkIfUserIsAuthorizedToModifyStructure("id", "requestUserId", [
        { nom: "test" },
      ]);
    } catch (error) {
      expect(error.message).toEqual("NO_STRUCTURE_WITH_THIS_ID");
    }
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect.assertions(2);
  });

  it("should throw USER_NOT_AUTHORIZED if user not authorized", async () => {
    getStructureFromDB.mockResolvedValueOnce({ _id: "id", membres: [] });

    try {
      await checkIfUserIsAuthorizedToModifyStructure("id", "requestUserId", [
        { nom: "test" },
      ]);
    } catch (error) {
      expect(error.message).toEqual("USER_NOT_AUTHORIZED");
    }
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
  });

  it("should return true if admin", async () => {
    getStructureFromDB.mockResolvedValueOnce({ _id: "id", membres: [] });

    const result = await checkIfUserIsAuthorizedToModifyStructure(
      "id",
      "requestUserId",
      [{ nom: "Admin" }]
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect(result).toEqual(true);
  });

  it("should return true if respo", async () => {
    getStructureFromDB.mockResolvedValueOnce({
      _id: "id",
      membres: [{ userId: "userId", roles: ["administrateur"] }],
    });

    const result = await checkIfUserIsAuthorizedToModifyStructure(
      "id",
      "userId",
      [{ nom: "test" }]
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect(result).toEqual(true);
  });

  it("should return true if contributeur", async () => {
    getStructureFromDB.mockResolvedValueOnce({
      _id: "id",
      membres: [{ userId: "userId", roles: ["contributeur"] }],
    });

    const result = await checkIfUserIsAuthorizedToModifyStructure(
      "id",
      "userId",
      [{ nom: "test" }]
    );
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect(result).toEqual(true);
  });

  it("should throw if getStructureFromDB throws", async () => {
    getStructureFromDB.mockRejectedValueOnce(new Error("erreur"));
    try {
      await checkIfUserIsAuthorizedToModifyStructure("id", "requestUserId", [
        { nom: "test" },
      ]);
    } catch (error) {
      expect(error.message).toEqual("erreur");
    }
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
  });
});

describe("getStructureMembers", () => {
  it("should call getStructureFromDB and return [] if no structure", async () => {
    getStructureFromDB.mockResolvedValueOnce(null);
    const res = await getStructureMembers("structureId");
    expect(getStructureFromDB).toHaveBeenCalledWith("structureId", false, {
      membres: 1,
    });
    expect(res).toEqual([]);
  });

  it("should call getStructureFromDB and return [] if structure without membres", async () => {
    getStructureFromDB.mockResolvedValueOnce({ _id: "id" });
    const res = await getStructureMembers("structureId");
    expect(getStructureFromDB).toHaveBeenCalledWith("structureId", false, {
      membres: 1,
    });
    expect(res).toEqual([]);
  });

  it("should call getStructureFromDB and return [] if structure without membres", async () => {
    getStructureFromDB.mockResolvedValueOnce({ _id: "id", membres: [] });
    const res = await getStructureMembers("structureId");
    expect(getStructureFromDB).toHaveBeenCalledWith("structureId", false, {
      membres: 1,
    });
    expect(res).toEqual([]);
  });

  it("should call getStructureFromDB and return membres", async () => {
    const membres = [{ _id: "membre1" }, { _id: "membre2" }];
    getStructureFromDB.mockResolvedValueOnce({ _id: "id", membres });
    const res = await getStructureMembers("structureId");
    expect(getStructureFromDB).toHaveBeenCalledWith("structureId", false, {
      membres: 1,
    });
    expect(res).toEqual(membres);
  });
});
