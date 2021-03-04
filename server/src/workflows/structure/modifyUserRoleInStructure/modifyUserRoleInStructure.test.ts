// @ts-nocheck
import { modifyUserRoleInStructure } from "./modifyUserRoleInStructure";
import { checkIfUserIsAuthorizedToModifyStructure } from "../../../modules/structure/structure.service";
import { updateStructureMember } from "../../../modules/structure/structure.repository";
import {
  removeRoleAndStructureOfUser,
  updateRoleAndStructureOfResponsable,
} from "../../../modules/users/users.service";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/structure/structure.repository", () => ({
  updateStructureMember: jest.fn(),
}));

jest.mock("../../../modules/structure/structure.service", () => ({
  checkIfUserIsAuthorizedToModifyStructure: jest.fn(),
}));

jest.mock("../../../modules/users/users.service", () => ({
  removeRoleAndStructureOfUser: jest.fn(),
  updateRoleAndStructureOfResponsable: jest.fn(),
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
    expect(updateStructureMember).not.toHaveBeenCalled();
    expect(updateRoleAndStructureOfResponsable).not.toHaveBeenCalled();
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
    expect(updateRoleAndStructureOfResponsable).not.toHaveBeenCalled();
    expect(updateStructureMember).not.toHaveBeenCalled();
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
    expect(updateRoleAndStructureOfResponsable).not.toHaveBeenCalled();

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
    expect(updateRoleAndStructureOfResponsable).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  const structureDelete = {
    _id: "structureId",
    $pull: { membres: { userId: "membreId" } },
  };

  const reqDelete = {
    user: { roles: ["test"] },
    userId: "userId",
    fromSite: true,
    body: {
      query: { ...structure, action: "delete" },
    },
  };
  it("should return 200 if delete ", async () => {
    await modifyUserRoleInStructure(reqDelete, res);
    expect(updateStructureMember).toHaveBeenCalledWith(
      "membreId",
      structureDelete
    );
    expect(removeRoleAndStructureOfUser).toHaveBeenCalledWith(
      "membreId",
      "structureId"
    );
    expect(updateRoleAndStructureOfResponsable).not.toHaveBeenCalled();

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
    expect(updateRoleAndStructureOfResponsable).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 500 if delete and removeRoleAndStructureOfUser throws", async () => {
    removeRoleAndStructureOfUser.mockRejectedValueOnce(new Error("erreur"));
    await modifyUserRoleInStructure(reqDelete, res);
    expect(updateStructureMember).toHaveBeenCalledWith(
      "membreId",
      structureDelete
    );
    expect(removeRoleAndStructureOfUser).toHaveBeenCalledWith(
      "membreId",
      "structureId"
    );
    expect(updateRoleAndStructureOfResponsable).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  const reqCreate = {
    user: { roles: ["test"] },
    userId: "userId",
    fromSite: true,
    body: {
      query: { ...structure, action: "create" },
    },
  };
  const structureCreate = {
    _id: "structureId",
    $addToSet: {
      membres: {
        userId: "membreId",
        roles: ["role"],
        added_at: new Date(1466424490000),
      },
    },
  };
  const mockDate = new Date(1466424490000);
  jest.spyOn(global, "Date").mockImplementation(() => mockDate);

  it("should return 200 if create ", async () => {
    await modifyUserRoleInStructure(reqCreate, res);
    expect(updateStructureMember).toHaveBeenCalledWith(null, structureCreate);
    expect(updateRoleAndStructureOfResponsable).toHaveBeenCalledWith(
      "membreId",
      "structureId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès" });
  });

  it("should return 500 if create and no role", async () => {
    await modifyUserRoleInStructure(
      {
        user: { roles: ["test"] },
        userId: "userId",
        fromSite: true,
        body: {
          query: { ...structure, role: null, action: "create" },
        },
      },
      res
    );
    expect(updateStructureMember).not.toHaveBeenCalled();
    expect(updateRoleAndStructureOfResponsable).not.toHaveBeenCalled();
    expect(removeRoleAndStructureOfUser).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 500 if create and removeRoleAndStructureOfUser throws", async () => {
    updateRoleAndStructureOfResponsable.mockRejectedValueOnce(
      new Error("erreur")
    );
    await modifyUserRoleInStructure(reqCreate, res);
    expect(updateStructureMember).toHaveBeenCalledWith(null, structureCreate);
    expect(updateRoleAndStructureOfResponsable).toHaveBeenCalledWith(
      "membreId",
      "structureId"
    );
    expect(removeRoleAndStructureOfUser).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });
});
