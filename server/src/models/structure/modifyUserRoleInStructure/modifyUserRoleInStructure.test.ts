// @ts-nocheck
import { modifyUserRoleInStructure } from "./modifyUserRoleInStructure";
import { checkIfUserIsAuthorizedToModifyStructure } from "../structure.service";
import { updateStructureMember } from "../structure.repository";
import { removeRoleAndStructureOfUser } from "../../../controllers/account/users.service";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../structure.repository", () => ({
  updateStructureMember: jest.fn(),
}));

jest.mock("../structure.service", () => ({
  checkIfUserIsAuthorizedToModifyStructure: jest.fn(),
}));

jest.mock("../../../controllers/account/users.service", () => ({
  removeRoleAndStructureOfUser: jest.fn(),
}));

describe("modifyUserRoleInStructure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    const req = { test: "a", fromSite: false };
    await modifyUserRoleInStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });
  it("should return 400 if no body", async () => {
    const req = { fromSite: true };
    await modifyUserRoleInStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no body query", async () => {
    const req = { fromSite: true, body: { test: "s" } };
    await modifyUserRoleInStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  const structure = {
    structureId: "structureId",
    action: "modify",
    role: "role",
    membreId: "membreId",
  };
  const req = {
    user: { roles: ["test"] },
    userId: "userId",
    fromSite: true,
    body: {
      query: structure,
    },
  };

  it("should return 402 if checkIfUserIsAuthorizedToModifyStructure throws NO_STRUCTURE_WITH_THIS_ID", async () => {
    checkIfUserIsAuthorizedToModifyStructure.mockRejectedValueOnce(
      new Error("NO_STRUCTURE_WITH_THIS_ID")
    );
    await modifyUserRoleInStructure(req, res);
    expect(
      checkIfUserIsAuthorizedToModifyStructure
    ).toHaveBeenCalledWith("structureId", "userId", ["test"]);
    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith({ text: "Id non valide" });
  });

  it("should return 401 if user not authorized", async () => {
    checkIfUserIsAuthorizedToModifyStructure.mockRejectedValueOnce(
      new Error("USER_NOT_AUTHORIZED")
    );
    await modifyUserRoleInStructure(req, res);
    expect(
      checkIfUserIsAuthorizedToModifyStructure
    ).toHaveBeenCalledWith("structureId", "userId", ["test"]);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ text: "Token invalide" });
  });

  const structureModify = {
    _id: "structureId",
    $set: { "membres.$.roles": ["role"] },
  };
  it("should return 200 if modify ", async () => {
    await modifyUserRoleInStructure(req, res);
    expect(updateStructureMember).toHaveBeenCalledWith(
      "membreId",
      structureModify
    );
    expect(removeRoleAndStructureOfUser).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès" });
  });

  it("should return 500 if modify and no role", async () => {
    await modifyUserRoleInStructure(
      {
        user: { roles: ["test"] },
        userId: "userId",
        fromSite: true,
        body: {
          query: { ...structure, role: null },
        },
      },
      res
    );
    expect(updateStructureMember).not.toHaveBeenCalled();
    expect(removeRoleAndStructureOfUser).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  const structureDelete = {
    _id: "structureId",
    $pull: { membres: { userId: "membreId" } },
  };
  it("should return 200 if delete ", async () => {
    await modifyUserRoleInStructure(
      {
        user: { roles: ["test"] },
        userId: "userId",
        fromSite: true,
        body: {
          query: { ...structure, action: "delete" },
        },
      },
      res
    );
    expect(updateStructureMember).toHaveBeenCalledWith(
      "membreId",
      structureDelete
    );
    expect(removeRoleAndStructureOfUser).toHaveBeenCalledWith(
      "membreId",
      "structureId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès" });
  });

  it("should return 500 if updateStructureMember throws", async () => {
    updateStructureMember.mockRejectedValueOnce(new Error("erreur"));
    await modifyUserRoleInStructure(req, res);
    expect(updateStructureMember).toHaveBeenCalledWith(
      "membreId",
      structureModify
    );
    expect(removeRoleAndStructureOfUser).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 500 if delete and removeRoleAndStructureOfUser throws", async () => {
    removeRoleAndStructureOfUser.mockRejectedValueOnce(new Error("erreur"));
    await modifyUserRoleInStructure(
      {
        user: { roles: ["test"] },
        userId: "userId",
        fromSite: true,
        body: {
          query: { ...structure, action: "delete" },
        },
      },
      res
    );
    expect(updateStructureMember).toHaveBeenCalledWith(
      "membreId",
      structureDelete
    );
    expect(removeRoleAndStructureOfUser).toHaveBeenCalledWith(
      "membreId",
      "structureId"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });
});
