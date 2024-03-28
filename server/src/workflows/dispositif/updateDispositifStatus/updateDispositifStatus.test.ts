//@ts-nocheck
import { updateDispositifStatus } from "./updateDispositifStatus";
import {
  updateDispositifInDB,
  getDispositifByIdWithMainSponsor,
} from "../../../modules/dispositif/dispositif.repository";
import { updateLanguagesAvancement } from "../../../modules/langues/langues.service";
import {

  checkUserIsAuthorizedToDeleteDispositif
} from "../../../libs/checkAuthorizations";
import { publishDispositif } from "../../../modules/dispositif/dispositif.service";
import { log } from "./log";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
jest.mock("airtable");
jest.mock("@sendgrid/mail");


describe.skip("updateDispositifStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it("should return a 200 when new status is actif and user admin", async () => {
    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "Actif" } },
      userId: "userId",
      user: { roles: [] },
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(publishDispositif).toHaveBeenCalledWith("id", "userId");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return a 404 when new status is actif and user not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    });

    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "Actif" } },
      user: { roles: [] },
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(publishDispositif).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ text: "Non authorisé" });
  });
  const neededFields = {
    creatorId: 1,
    mainSponsor: 1,
    status: 1,
    typeContenu: 1,
    contenu: 1
  };
  it("should return a 200 when new status is supprimé and user authorized and demarche", async () => {
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
    expect(checkUserIsAuthorizedToDeleteDispositif).toHaveBeenCalledWith(
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
    checkUserIsAuthorizedToDeleteDispositif.mockImplementationOnce(() => {
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
    expect(checkUserIsAuthorizedToDeleteDispositif).toHaveBeenCalledWith(
      { _id: "id" },
      "userId",
      []
    );

    expect(updateDispositifInDB).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ text: "Non authorisé" });
  });

  it("should return a 200 when new status is supprimé and user authorized and dispositif", async () => {
    const dispo = {
      typeContenu: "dispositif",
      titreInformatif: "TI",
      titreMarque: "TM",
      _id: "id",
      theme: { _id: "theme" },
    };
    updateDispositifInDB.mockResolvedValueOnce(dispo);

    getDispositifByIdWithMainSponsor.mockResolvedValueOnce(dispo);
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
    expect(checkUserIsAuthorizedToDeleteDispositif).toHaveBeenCalledWith(
      dispo,
      "userId",
      []
    );
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      status: "Supprimé",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });
});
