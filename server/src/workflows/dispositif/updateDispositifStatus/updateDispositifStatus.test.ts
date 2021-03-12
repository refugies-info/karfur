// @ts-nocheck
import { updateDispositifStatus } from "./updateDispositifStatus";
import { updateDispositifInDB } from "../../../controllers/dispositif/dispositif.repository";
import { updateLanguagesAvancement } from "../../../controllers/langues/langues.service";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../controllers/langues/langues.service", () => ({
  updateLanguagesAvancement: jest.fn(),
}));

jest.mock("../../../controllers/dispositif/dispositif.repository", () => ({
  updateDispositifInDB: jest.fn(),
}));

describe("updateDispositifStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return a 405 when no fromSite", async () => {
    const req = { body: {} };
    const res = mockResponse();
    await updateDispositifStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });

  it("should return a 400 when no body", async () => {
    const req = { fromSite: true };
    const res = mockResponse();
    await updateDispositifStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return a 400 when no query", async () => {
    const req = { fromSite: true, body: { test: "" } };
    const res = mockResponse();
    await updateDispositifStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return a 200 when new status is not actif", async () => {
    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "En attente" } },
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "En attente",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return a 500 when updateDispositifInDB throws", async () => {
    updateDispositifInDB.mockRejectedValueOnce(new Error("error"));
    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "En attente" } },
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "En attente",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should return a 200 when new status is actif", async () => {
    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "Actif" } },
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return a 200 when new status is actif and updateLanguagesAvancement throws", async () => {
    updateLanguagesAvancement.mockRejectedValueOnce(new Error("erreur"));
    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "Actif" } },
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });
});
