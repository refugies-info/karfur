// @ts-nocheck
import { updateStructure } from "./updateStructure";
import {
  getStructureFromDB,
  updateStructureInDB,
} from "../structure.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../structure.repository", () => ({
  getStructureFromDB: jest.fn(),
  updateStructureInDB: jest.fn().mockResolvedValue({
    nom: "structure",
    acronyme: "acronyme",
    _id: "id",
  }),
}));

describe("updateStructure", () => {
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
    _id: "id",
  };
  const req = {
    user: { roles: ["test"] },
    userId: "userId",
    fromSite: true,
    body: {
      query: structure,
    },
  };

  it("should return 402 if no structure with this id ", async () => {
    getStructureFromDB.mockResolvedValueOnce(null);

    await updateStructure(req, res);
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith({ text: "Id non valide" });
  });

  it("should return 401 if user not authorized", async () => {
    getStructureFromDB.mockResolvedValueOnce({ _id: "id", membres: [] });

    await updateStructure(req, res);
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ text: "Token invalide" });
  });

  it("should camm updateSTructureInDB if admin", async () => {
    getStructureFromDB.mockResolvedValueOnce({ _id: "id", membres: [] });

    await updateStructure({ ...req, user: { roles: [{ nom: "Admin" }] } }, res);
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect(updateStructureInDB).toHaveBeenCalledWith("id", {
      nom: "structure",
      acronyme: "acronyme",
      _id: "id",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: structure,
    });
  });

  it("should camm updateStructureInDB if respo", async () => {
    getStructureFromDB.mockResolvedValueOnce({
      _id: "id",
      membres: [{ userId: "userId", roles: ["administrateur"] }],
    });

    await updateStructure(req, res);
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect(updateStructureInDB).toHaveBeenCalledWith("id", {
      nom: "structure",
      acronyme: "acronyme",
      _id: "id",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: structure,
    });
  });

  it("should call updateStructureInDB if contributeur", async () => {
    getStructureFromDB.mockResolvedValueOnce({
      _id: "id",
      membres: [{ userId: "userId", roles: ["contributeur"] }],
    });

    await updateStructure(req, res);
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect(updateStructureInDB).toHaveBeenCalledWith("id", {
      nom: "structure",
      acronyme: "acronyme",
      _id: "id",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: structure,
    });
  });

  it("should return 500 if getStructureFromDB throws", async () => {
    getStructureFromDB.mockRejectedValueOnce(new Error("erreur"));

    await updateStructure(req, res);
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect(updateStructureInDB).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should return 500 if updateStructureInDB throws", async () => {
    updateStructureInDB.mockRejectedValueOnce(new Error("erreur"));
    getStructureFromDB.mockResolvedValueOnce({
      _id: "id",
      membres: [{ userId: "userId", roles: ["contributeur"] }],
    });
    await updateStructure(req, res);
    expect(getStructureFromDB).toHaveBeenCalledWith("id", false, {
      membres: 1,
    });
    expect(updateStructureInDB).toHaveBeenCalledWith("id", {
      nom: "structure",
      acronyme: "acronyme",
      _id: "id",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
