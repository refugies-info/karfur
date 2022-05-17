// @ts-nocheck
import { createStructure } from "./createStructure";
import { createStructureInDB } from "../../../modules/structure/structure.repository";
import { updateRoleAndStructureOfResponsable } from "../../../modules/users/users.service";
import { log } from "./log";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/structure/structure.repository", () => ({
  createStructureInDB: jest.fn().mockResolvedValue({ _id: "id" }),
}));
jest.mock("./log", () => ({
  log: jest.fn().mockResolvedValue(undefined)
}));
jest.mock("../../../modules/users/users.service", () => ({
  updateRoleAndStructureOfResponsable: jest.fn(),
}));

describe("createStructure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();
  it("should return 405 if not from site", async () => {
    const req = { test: "a", fromSite: false };
    await createStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });
  it("should return 400 if no body", async () => {
    const req = { fromSite: true };
    await createStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no body query", async () => {
    const req = { fromSite: true, body: { test: "s" } };
    await createStructure(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  const req = {
    userId: "userId",
    fromSite: true,
    body: {
      query: {
        nom: "structure",
        membres: [],
      },
    },
  };

  it("should return 200 when no membres", async () => {
    await createStructure(req, res);
    expect(createStructureInDB).toHaveBeenCalledWith({
      nom: "structure",
      membres: [],
      status: "En attente",
      createur: "userId",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: {
        _id: "id",
      },
    });
  });

  it("should return 500 when createStructureInDB throws", async () => {
    createStructureInDB.mockRejectedValueOnce(new Error("error"));

    await createStructure(req, res);
    expect(createStructureInDB).toHaveBeenCalledWith({
      nom: "structure",
      membres: [],
      status: "En attente",
      createur: "userId",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  const reqWithMembres = {
    userId: "userId",
    fromSite: true,
    body: {
      query: {
        nom: "structure",
        membres: [{ userId: "userId2", roles: ["admin"] }],
      },
    },
  };

  it("should return 200 and call updateRoleAndStructureOfResponsable when membres", async () => {
    createStructureInDB.mockResolvedValueOnce({
      _id: "id",
      membres: [{ userId: "userId2" }],
    });
    await createStructure(reqWithMembres, res);
    expect(createStructureInDB).toHaveBeenCalledWith({
      nom: "structure",
      membres: [{ userId: "userId2", roles: ["admin"] }],
      status: "En attente",
      createur: "userId",
    });
    expect(updateRoleAndStructureOfResponsable).toHaveBeenCalledWith(
      "userId2",
      "id"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: {
        _id: "id",
        membres: [{ userId: "userId2" }],
      },
    });
  });

  it("should return 500 if updateRoleAndStructureOfResponsable throws", async () => {
    createStructureInDB.mockResolvedValueOnce({
      _id: "id",
      membres: [{ userId: "userId2" }],
    });

    updateRoleAndStructureOfResponsable.mockRejectedValueOnce(
      new Error("erreur")
    );
    await createStructure(reqWithMembres, res);
    expect(createStructureInDB).toHaveBeenCalledWith({
      nom: "structure",
      membres: [{ userId: "userId2", roles: ["admin"] }],
      status: "En attente",
      createur: "userId",
    });
    expect(updateRoleAndStructureOfResponsable).toHaveBeenCalledWith(
      "userId2",
      "id"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return 200 if createStructureInDB returns no membres", async () => {
    createStructureInDB.mockResolvedValueOnce({
      _id: "id",
    });

    await createStructure(reqWithMembres, res);
    expect(createStructureInDB).toHaveBeenCalledWith({
      nom: "structure",
      membres: [{ userId: "userId2", roles: ["admin"] }],
      status: "En attente",
      createur: "userId",
    });
    expect(updateRoleAndStructureOfResponsable).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: { _id: "id" },
    });
  });
});
