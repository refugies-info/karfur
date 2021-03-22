// @ts-nocheck
import { updateDispositifStatus } from "./updateDispositifStatus";
import {
  updateDispositifInDB,
  getDispositifByIdWithMainSponsor,
} from "../../../modules/dispositif/dispositif.repository";
import { updateLanguagesAvancement } from "../../../controllers/langues/langues.service";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import {
  checkRequestIsFromSite,
  checkIfUserIsAdmin,
  checkUserIsAuthorizedToModifyDispositif,
} from "../../../libs/checkAuthorizations";

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

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  updateDispositifInDB: jest.fn(),
  getDispositifByIdWithMainSponsor: jest.fn().mockResolvedValue({ _id: "id" }),
}));

jest.mock("../../../controllers/miscellaneous/airtable", () => ({
  addOrUpdateDispositifInContenusAirtable: jest.fn(),
}));

jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn(),
  checkIfUserIsAdmin: jest.fn(),
  checkUserIsAuthorizedToModifyDispositif: jest.fn(),
}));

describe("updateDispositifStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return a 405 when no fromSite", async () => {
    checkRequestIsFromSite.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_SITE");
    });
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

  it("should return a 200 when new status is actif and not a dispositif and user admin", async () => {
    updateDispositifInDB.mockResolvedValueOnce({ typeContenu: "demarche" });
    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "Actif" } },
      user: { roles: [] },
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return a 200 when new status is actif and updateLanguagesAvancement throws", async () => {
    updateLanguagesAvancement.mockRejectedValueOnce(new Error("erreur"));
    updateDispositifInDB.mockResolvedValueOnce({ typeContenu: "demarche" });
    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "Actif" } },
      user: { roles: [] },
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

  it("should return a 200 when new status is actif and a dispositif and user admin", async () => {
    updateDispositifInDB.mockResolvedValueOnce({
      typeContenu: "dispositif",
      titreInformatif: "ti",
      titreMarque: "tm",
      _id: "id",
      tags: [],
    });
    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "Actif" } },
      user: { roles: [] },
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Actif",
      publishedAt: date,
    });
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "ti",
      "tm",
      "id",
      [],
      null
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return a 404 when new status is actif and user not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    });
    updateLanguagesAvancement.mockRejectedValueOnce(new Error("erreur"));
    updateDispositifInDB.mockResolvedValueOnce({ typeContenu: "demarche" });
    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "Actif" } },
      user: { roles: [] },
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(updateDispositifInDB).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ text: "Non authorisé" });
  });
  const neededFields = {
    creatorId: 1,
    mainSponsor: 1,
    status: 1,
  };
  it("should return a 200 when new status is supprimé and user authorized", async () => {
    updateDispositifInDB.mockResolvedValueOnce({ typeContenu: "demarche" });
    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "Supprimé" } },
      user: { roles: [] },
      userId: "userId",
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(getDispositifByIdWithMainSponsor).toHaveBeenCalledWith(
      "id",
      neededFields
    );
    expect(checkUserIsAuthorizedToModifyDispositif).toHaveBeenCalledWith(
      { _id: "id" },
      "userId",
      []
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Supprimé",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return a 404 when new status is supprimé and user not authorized", async () => {
    checkUserIsAuthorizedToModifyDispositif.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    });
    updateDispositifInDB.mockResolvedValueOnce({ typeContenu: "demarche" });
    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "Supprimé" } },
      user: { roles: [] },
      userId: "userId",
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);
    expect(getDispositifByIdWithMainSponsor).toHaveBeenCalledWith(
      "id",
      neededFields
    );
    expect(checkUserIsAuthorizedToModifyDispositif).toHaveBeenCalledWith(
      { _id: "id" },
      "userId",
      []
    );
    expect(updateDispositifInDB).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ text: "Non authorisé" });
  });
});
