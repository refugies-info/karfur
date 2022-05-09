// @ts-nocheck
import { modifyDispositifMainSponsor } from "./modifyDispositifMainSponsor";
import { updateDispositifInDB, getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { updateAssociatedDispositifsInStructure } from "../../../modules/structure/structure.repository";
import { log } from "./log";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/structure/structure.repository", () => ({
  updateAssociatedDispositifsInStructure: jest.fn(),
}));
jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  updateDispositifInDB: jest.fn(),
  getDispositifById: jest.fn().mockResolvedValue({}),
}));

jest.mock("../../../libs/checkAuthorizations", () => ({
  checkIfUserIsAdmin: jest.fn(),
}));
jest.mock("./log", () => ({
  log: jest.fn().mockResolvedValue(undefined)
}));

describe("modifyDispositifMainSponsor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 if not fromSite", async () => {
    const req = { body: {} };
    const res = mockResponse();
    await modifyDispositifMainSponsor(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });

  it("should return 400 if no body", async () => {
    const req = { fromSite: true };
    const res = mockResponse();
    await modifyDispositifMainSponsor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no query", async () => {
    const req = { fromSite: true, body: {} };
    const res = mockResponse();
    await modifyDispositifMainSponsor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no dispositifId", async () => {
    const req = {
      fromSite: true,
      body: { query: { sponsorId: "test", status: "s" } },
    };

    const res = mockResponse();
    await modifyDispositifMainSponsor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no status", async () => {
    const req = {
      fromSite: true,
      body: { query: { sponsorId: "test", dispositifId: "test" } },
    };

    const res = mockResponse();
    await modifyDispositifMainSponsor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no sponsorId", async () => {
    const req = {
      fromSite: true,
      body: { query: { dispositifId: "test2", status: "s" } },
    };

    const res = mockResponse();
    await modifyDispositifMainSponsor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should call updateDispositifInDB and updateAssociatedDispositifsInStructure and return a 200 ", async () => {
    const req = {
      fromSite: true,
      user: { roles: [{ nom: "Admin" }], _id: "userId" },
      body: {
        query: {
          dispositifId: "dispositifId",
          sponsorId: "sponsorId",
          status: "En attente",
        },
      },
    };

    const res = mockResponse();
    await modifyDispositifMainSponsor(req, res);

    expect(updateDispositifInDB).toHaveBeenCalledWith("dispositifId", {
      mainSponsor: "sponsorId",
      status: "En attente",
    });
    expect(updateAssociatedDispositifsInStructure).toHaveBeenCalledWith(
      "dispositifId",
      "sponsorId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should call updateDispositifInDB and return a 500 if updateDispositifInDB throws", async () => {
    updateDispositifInDB.mockRejectedValueOnce(new Error("error"));

    const req = {
      fromSite: true,
      user: {roles: [{nom: "Admin"}], _id: "userId"},
      body: {
        query: {
          dispositifId: "dispositifId",
          sponsorId: "sponsorId",
          status: "En attente",
        },
      },
    };

    const res = mockResponse();
    await modifyDispositifMainSponsor(req, res);

    expect(updateDispositifInDB).toHaveBeenCalledWith("dispositifId", {
      mainSponsor: "sponsorId",
      status: "En attente",
    });
    expect(updateAssociatedDispositifsInStructure).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should call updateDispositifInDB and return a 500 if updateDispositifInDB throws", async () => {
    updateAssociatedDispositifsInStructure.mockRejectedValueOnce(
      new Error("error")
    );

    const req = {
      fromSite: true,
      user: {roles: [{nom: "Admin"}], _id: "userId"},
      body: {
        query: {
          dispositifId: "dispositifId",
          sponsorId: "sponsorId",
          status: "Actif",
        },
      },
    };

    const res = mockResponse();
    await modifyDispositifMainSponsor(req, res);

    expect(updateDispositifInDB).toHaveBeenCalledWith("dispositifId", {
      mainSponsor: "sponsorId",
      status: "Actif",
    });
    expect(updateAssociatedDispositifsInStructure).toHaveBeenCalledWith(
      "dispositifId",
      "sponsorId"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should call updateDispositifInDB and updateAssociatedDispositifsInStructure and return a 200 ", async () => {
    const req = {
      fromSite: true,
      user: {roles: [{nom: "Admin"}], _id: "userId"},
      body: {
        query: {
          dispositifId: "dispositifId",
          sponsorId: "sponsorId",
          status: "En attente non prioritaire",
        },
      },
    };

    const res = mockResponse();
    await modifyDispositifMainSponsor(req, res);

    expect(updateDispositifInDB).toHaveBeenCalledWith("dispositifId", {
      mainSponsor: "sponsorId",
      status: "En attente",
    });
    expect(updateAssociatedDispositifsInStructure).toHaveBeenCalledWith(
      "dispositifId",
      "sponsorId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });
});
