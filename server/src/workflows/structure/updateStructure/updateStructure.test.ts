// @ts-nocheck
import { updateStructure } from "./updateStructure";
import { updateStructureInDB } from "../../../modules/structure/structure.repository";
import { checkIfUserIsAuthorizedToModifyStructure } from "../../../modules/structure/structure.service";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

/* jest.mock("../../../modules/structure/structure.repository", () => ({
  updateStructureInDB: jest.fn().mockResolvedValue({
    nom: "structure",
    acronyme: "acronyme",
    _id: "id"
  }),
  getStructureFromDB: jest.fn().mockResolvedValue({}),
  findUsers: jest.fn().mockResolvedValue({})
}));

jest.mock("../../../modules/structure/structure.service", () => ({
  checkIfUserIsAuthorizedToModifyStructure: jest.fn()
}));
jest.mock("./log", () => ({
  log: jest.fn().mockResolvedValue(undefined)
}));

jest.mock("../../../modules/users/users.service", () => ({
  findUsers: jest.fn().mockRejectedValueOnce([])
})); */

describe.skip("updateStructure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    const req = { test: "a", fromSite: false };
    await updateStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });
  it("should return 400 if no body", async () => {
    const req = { fromSite: true };
    await updateStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no body query", async () => {
    const req = { fromSite: true, body: { test: "s" } };
    await updateStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  const structure = {
    nom: "structure",
    acronyme: "acronyme",
    _id: "id"
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
    await updateStructure(req, res);
    expect(checkIfUserIsAuthorizedToModifyStructure).toHaveBeenCalledWith("id", "userId", ["test"]);
    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith({ text: "Id non valide" });
  });

  it("should return 401 if user not authorized", async () => {
    checkIfUserIsAuthorizedToModifyStructure.mockRejectedValueOnce(new Error("USER_NOT_AUTHORIZED"));
    await updateStructure(req, res);
    expect(checkIfUserIsAuthorizedToModifyStructure).toHaveBeenCalledWith("id", "userId", ["test"]);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ text: "Token invalide" });
  });

  it("should call updateStructureInDB if authorized", async () => {
    await updateStructure({ ...req, user: { roles: [{ nom: "Admin" }] } }, res);

    expect(updateStructureInDB).toHaveBeenCalledWith("id", {
      nom: "structure",
      acronyme: "acronyme",
      _id: "id"
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: structure
    });
  });

  it("should return 500 if checkIfUserIsAuthorizedToModifyStructure throws", async () => {
    checkIfUserIsAuthorizedToModifyStructure.mockRejectedValueOnce(new Error("ERREUR"));

    await updateStructure(req, res);

    expect(updateStructureInDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne"
    });
  });

  it("should return 500 if updateStructureInDB throws", async () => {
    updateStructureInDB.mockRejectedValueOnce(new Error("erreur"));

    await updateStructure(req, res);

    expect(updateStructureInDB).toHaveBeenCalledWith("id", {
      nom: "structure",
      acronyme: "acronyme",
      _id: "id"
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne"
    });
  });
});
