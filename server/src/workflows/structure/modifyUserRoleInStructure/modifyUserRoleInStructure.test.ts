// @ts-nocheck
/* import { modifyUserRoleInStructure } from "./modifyUserRoleInStructure";
import { checkIfUserIsAuthorizedToModifyStructure } from "../../../modules/structure/structure.service";
import { updateStructureMember, getStructureFromDB } from "../../../modules/structure/structure.repository";
import { removeStructureOfUser, addStructureForUsers } from "../../../modules/users/users.service";
import { sendNewReponsableMailService } from "../../../modules/mail/mail.service";
import { getUserById } from "../../../modules/users/users.repository";
import { getRoleByName } from "../../../controllers/role/role.repository";
import { log } from "./log"; */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

/* jest.mock("../../../modules/structure/structure.repository", () => ({
  updateStructureMember: jest.fn(),
  getStructureFromDB: jest.fn().mockResolvedValue({
    _id: "structureId",
    nom: "My Structure"
  })
}));
jest.mock("../../../modules/users/users.repository", () => ({
  getUserById: jest.fn()
}));
jest.mock("../../../modules/structure/structure.service", () => ({
  checkIfUserIsAuthorizedToModifyStructure: jest.fn()
}));
jest.mock("../../../modules/users/users.service", () => ({
  removeStructureOfUser: jest.fn(),
  addStructureForUsers: jest.fn()
}));
jest.mock("../../../modules/mail/mail.service", () => ({
  sendNewReponsableMailService: jest.fn()
}));
jest.mock("../../../controllers/role/role.repository", () => ({
  getRoleByName: jest.fn().mockResolvedValue({
    _id: "adminRole"
  })
}));
jest.mock("./log", () => ({
  log: jest.fn().mockResolvedValue(undefined)
})); */

describe.skip("modifyUserRoleInStructure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    const req = { test: "a", fromSite: false };
    await modifyUserRoleInStructure(req, res);
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });
  it("should return 400 if no body", async () => {
    const req = { fromSite: true };
    await modifyUserRoleInStructure(req, res);
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no body query", async () => {
    const req = { fromSite: true, body: { test: "s" } };
    await modifyUserRoleInStructure(req, res);
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  const user = {
    _id: "userId",
    username: "user",
    email: "test@test.com",
    roles: ["userRole"]
  };
  const structure = {
    structureId: "structureId",
    action: "modify",
    role: "contributeur",
    membreId: "membreId"
  };
  const req = {
    user: { roles: ["test"] },
    userId: "userId",
    fromSite: true,
    body: {
      query: structure
    }
  };

  it("should return 402 if checkIfUserIsAuthorizedToModifyStructure throws NO_STRUCTURE_WITH_THIS_ID", async () => {
    checkIfUserIsAuthorizedToModifyStructure.mockRejectedValueOnce(new Error("NO_STRUCTURE_WITH_THIS_ID"));
    await modifyUserRoleInStructure(req, res);
    expect(checkIfUserIsAuthorizedToModifyStructure).toHaveBeenCalledWith("structureId", "userId", ["test"]);
    expect(updateStructureMember).not.toHaveBeenCalled();
    expect(addStructureForUsers).not.toHaveBeenCalled();
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith({ text: "Id non valide" });
  });

  it("should return 401 if user not authorized", async () => {
    checkIfUserIsAuthorizedToModifyStructure.mockRejectedValueOnce(new Error("USER_NOT_AUTHORIZED"));
    await modifyUserRoleInStructure(req, res);
    expect(checkIfUserIsAuthorizedToModifyStructure).toHaveBeenCalledWith("structureId", "userId", ["test"]);
    expect(addStructureForUsers).not.toHaveBeenCalled();
    expect(updateStructureMember).not.toHaveBeenCalled();
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ text: "Token invalide" });
  });

  it("should return 200 if modify to contributeur and not send email", async () => {
    await modifyUserRoleInStructure(req, res);
    expect(updateStructureMember).toHaveBeenCalledWith("membreId", {
      _id: "structureId",
      $set: { "membres.$.roles": ["contributeur"] }
    });
    expect(removeStructureOfUser).not.toHaveBeenCalled();
    expect(addStructureForUsers).not.toHaveBeenCalled();
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès" });
  });

  it("should return 200 if modify to responsable and send email", async () => {
    const requestResponsable = JSON.parse(JSON.stringify(req)); // deep copy
    requestResponsable.body.query.role = "administrateur";

    getUserById.mockResolvedValueOnce(user);
    await modifyUserRoleInStructure(requestResponsable, res);
    expect(updateStructureMember).toHaveBeenCalledWith("membreId", {
      _id: "structureId",
      $set: { "membres.$.roles": ["administrateur"] }
    });
    expect(removeStructureOfUser).not.toHaveBeenCalled();
    expect(addStructureForUsers).not.toHaveBeenCalled();

    expect(getUserById).toHaveBeenCalled();
    expect(getRoleByName).toHaveBeenCalled();
    expect(getStructureFromDB).toHaveBeenCalled();
    expect(sendNewReponsableMailService).toHaveBeenCalledWith({
      pseudonyme: "user",
      email: "test@test.com",
      userId: "userId",
      nomstructure: "My Structure"
    });

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
          query: { ...structure, role: null }
        }
      },
      res
    );
    expect(updateStructureMember).not.toHaveBeenCalled();
    expect(removeStructureOfUser).not.toHaveBeenCalled();
    expect(addStructureForUsers).not.toHaveBeenCalled();
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  const structureDelete = {
    _id: "structureId",
    $pull: { membres: { userId: "membreId" } }
  };

  const reqDelete = {
    user: { roles: ["test"] },
    userId: "userId",
    fromSite: true,
    body: {
      query: { ...structure, action: "delete" }
    }
  };
  it("should return 200 if delete ", async () => {
    await modifyUserRoleInStructure(reqDelete, res);
    expect(updateStructureMember).toHaveBeenCalledWith("membreId", structureDelete);
    expect(removeStructureOfUser).toHaveBeenCalledWith("membreId", "structureId");
    expect(addStructureForUsers).not.toHaveBeenCalled();
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès" });
  });

  it("should return 500 if updateStructureMember throws", async () => {
    updateStructureMember.mockRejectedValueOnce(new Error("erreur"));
    await modifyUserRoleInStructure(req, res);
    expect(updateStructureMember).toHaveBeenCalledWith("membreId", {
      _id: "structureId",
      $set: { "membres.$.roles": ["contributeur"] }
    });
    expect(removeStructureOfUser).not.toHaveBeenCalled();
    expect(addStructureForUsers).not.toHaveBeenCalled();
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 500 if delete and removeStructureOfUser throws", async () => {
    removeStructureOfUser.mockRejectedValueOnce(new Error("erreur"));
    await modifyUserRoleInStructure(reqDelete, res);
    expect(updateStructureMember).toHaveBeenCalledWith("membreId", structureDelete);
    expect(removeStructureOfUser).toHaveBeenCalledWith("membreId", "structureId");
    expect(addStructureForUsers).not.toHaveBeenCalled();
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  const reqCreate = {
    user: { roles: ["test"] },
    userId: "userId",
    fromSite: true,
    body: {
      query: { ...structure, action: "create" }
    }
  };
  const structureCreate = {
    _id: "structureId",
    $addToSet: {
      membres: {
        userId: "membreId",
        roles: ["contributeur"],
        added_at: new Date(1466424490000)
      }
    }
  };
  const structureCreateResponsable = {
    _id: "structureId",
    $addToSet: {
      membres: {
        userId: "membreId",
        roles: ["administrateur"],
        added_at: new Date(1466424490000)
      }
    }
  };
  const mockDate = new Date(1466424490000);
  jest.spyOn(global, "Date").mockImplementation(() => mockDate);

  it("should return 200 if create and not send email", async () => {
    await modifyUserRoleInStructure(reqCreate, res);
    expect(updateStructureMember).toHaveBeenCalledWith(null, structureCreate);
    expect(addStructureForUsers).toHaveBeenCalledWith(["membreId"], "structureId");
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "Succès" });
  });

  it("should return 200 if create responsable and send email", async () => {
    const requestResponsable = JSON.parse(JSON.stringify(reqCreate)); // deep copy
    requestResponsable.body.query.role = "administrateur";

    getUserById.mockResolvedValueOnce(user);

    await modifyUserRoleInStructure(requestResponsable, res);
    expect(updateStructureMember).toHaveBeenCalledWith(null, structureCreateResponsable);
    expect(addStructureForUsers).toHaveBeenCalledWith(["membreId"], "structureId");
    expect(getUserById).toHaveBeenCalled();
    expect(getRoleByName).toHaveBeenCalled();
    expect(getStructureFromDB).toHaveBeenCalled();
    expect(sendNewReponsableMailService).toHaveBeenCalledWith({
      pseudonyme: "user",
      email: "test@test.com",
      userId: "userId",
      nomstructure: "My Structure"
    });

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
          query: { ...structure, role: null, action: "create" }
        }
      },
      res
    );
    expect(updateStructureMember).not.toHaveBeenCalled();
    expect(addStructureForUsers).not.toHaveBeenCalled();
    expect(removeStructureOfUser).not.toHaveBeenCalled();
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 200 if create responsable of an admin and not send email", async () => {
    const requestResponsable = JSON.parse(JSON.stringify(reqCreate)); // deep copy
    requestResponsable.body.query.role = "administrateur";

    getUserById.mockResolvedValueOnce({ ...user, roles: ["adminRole"] });

    await modifyUserRoleInStructure(requestResponsable, res);
    expect(updateStructureMember).toHaveBeenCalledWith(null, structureCreateResponsable);
    expect(addStructureForUsers).toHaveBeenCalledWith(["membreId"], "structureId");
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();

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
          query: { ...structure, role: null, action: "create" }
        }
      },
      res
    );
    expect(updateStructureMember).not.toHaveBeenCalled();
    expect(addStructureForUsers).not.toHaveBeenCalled();
    expect(removeStructureOfUser).not.toHaveBeenCalled();
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 500 if create and removeStructureOfUser throws", async () => {
    addStructureForUsers.mockRejectedValueOnce(new Error("erreur"));
    await modifyUserRoleInStructure(reqCreate, res);
    expect(updateStructureMember).toHaveBeenCalledWith(null, structureCreate);
    expect(addStructureForUsers).toHaveBeenCalledWith(["membreId"], "structureId");
    expect(removeStructureOfUser).not.toHaveBeenCalled();
    expect(sendNewReponsableMailService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });
});
