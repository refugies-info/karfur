// @ts-nocheck
import { validateTranslations } from "./validateTranslations";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import {
  validateTradInDB,
  deleteTradsInDB,
} from "../../../modules/traductions/traductions.repository";
import { insertInDispositif } from "../../../modules/dispositif/insertInDispositif";
import { updateLanguagesAvancement } from "../../../controllers/langues/langues.service";
import { getDispositifByIdWithAllFields } from "../../../modules/dispositif/dispositif.repository";
import { sendPublishedTradMailToStructure } from "../../../modules/mail/sendPublishedTradMailToStructure";
import { sendPublishedTradMailToTraductors } from "../../../modules/mail/sendPublishedTradMailToTraductors";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/mail/sendPublishedTradMailToTraductors", () => ({
  sendPublishedTradMailToTraductors: jest.fn(),
}));

jest.mock("../../../controllers/miscellaneous/airtable", () => ({
  addOrUpdateDispositifInContenusAirtable: jest.fn(),
}));

jest.mock("../../../modules/traductions/traductions.repository", () => ({
  validateTradInDB: jest.fn(),
  deleteTradsInDB: jest.fn(),
}));

jest.mock("../../../modules/dispositif/insertInDispositif", () => ({
  insertInDispositif: jest.fn(),
}));

jest.mock("../../../controllers/langues/langues.service", () => ({
  updateLanguagesAvancement: jest.fn(),
}));

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getDispositifByIdWithAllFields: jest.fn(),
}));

jest.mock("../../../modules/mail/sendPublishedTradMailToStructure", () => ({
  sendPublishedTradMailToStructure: jest.fn(),
}));

describe("validateTranslations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();
  it("should return 405 if not from site", async () => {
    const req = {};
    await validateTranslations(req, res);
    expect(validateTradInDB).not.toHaveBeenCalled();
    expect(deleteTradsInDB).not.toHaveBeenCalled();
    expect(getDispositifByIdWithAllFields).not.toHaveBeenCalled();
    expect(insertInDispositif).not.toHaveBeenCalled();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true };
    await validateTranslations(req, res);
    expect(validateTradInDB).not.toHaveBeenCalled();
    expect(deleteTradsInDB).not.toHaveBeenCalled();
    expect(getDispositifByIdWithAllFields).not.toHaveBeenCalled();
    expect(insertInDispositif).not.toHaveBeenCalled();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true, body: { translatedText: "text" } };
    await validateTranslations(req, res);
    expect(validateTradInDB).not.toHaveBeenCalled();
    expect(deleteTradsInDB).not.toHaveBeenCalled();
    expect(getDispositifByIdWithAllFields).not.toHaveBeenCalled();
    expect(insertInDispositif).not.toHaveBeenCalled();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true, body: { articleId: "text" } };
    await validateTranslations(req, res);
    expect(validateTradInDB).not.toHaveBeenCalled();
    expect(deleteTradsInDB).not.toHaveBeenCalled();
    expect(getDispositifByIdWithAllFields).not.toHaveBeenCalled();
    expect(insertInDispositif).not.toHaveBeenCalled();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 401 if not admin or expert", async () => {
    const req = {
      fromSite: true,
      body: { articleId: "id", translatedText: "text" },
      user: { roles: [] },
    };
    await validateTranslations(req, res);
    expect(validateTradInDB).not.toHaveBeenCalled();
    expect(deleteTradsInDB).not.toHaveBeenCalled();
    expect(getDispositifByIdWithAllFields).not.toHaveBeenCalled();
    expect(insertInDispositif).not.toHaveBeenCalled();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
  const req = {
    fromSite: true,
    body: {
      articleId: "articleId",
      translatedText: "text",
      traductions: [],
      _id: "id",
      locale: "locale",
    },
    user: { roles: [{ nom: "ExpertTrad" }] },
    userId: "userId",
  };

  const dispoFromDB = {
    typeContenu: "dispositif",
    titreInformatif: "TI",
    titreMarque: "TM",
    _id: "id",
  };
  it("should validate trad in db, delete trad, update content in AT and updateLanguages avancement if expert", async () => {
    insertInDispositif.mockResolvedValueOnce({
      insertedDispositif: {
        typeContenu: "dispositif",
        id: "id_dispo",
      },
      traductorIdsList: ["userId1", "userId2", "userId"],
    });

    getDispositifByIdWithAllFields.mockResolvedValue(dispoFromDB);

    await validateTranslations(req, res);
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).toHaveBeenCalledWith("articleId", "locale");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(insertInDispositif).toHaveBeenCalledWith(
      req.body,
      "locale",
      dispoFromDB
    );
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "",
      "",
      "id_dispo",
      [],
      "locale"
    );
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(sendPublishedTradMailToStructure).toHaveBeenCalledWith(
      dispoFromDB,
      "locale"
    );
    expect(sendPublishedTradMailToTraductors).toHaveBeenCalledWith(
      ["userId1", "userId2"],
      "locale",
      "dispositif",
      "TI",
      "TM",
      "id",
      "userId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should validate trad in db, delete trad, update content in AT and updateLanguages avancement if admin", async () => {
    insertInDispositif.mockResolvedValueOnce({
      insertedDispositif: {
        typeContenu: "dispositif",
        id: "id_dispo",
      },
      traductorIdsList: ["userId1", "userId2", "userId"],
    });

    await validateTranslations(
      { ...req, user: { roles: [{ nom: "Admin" }] } },
      res
    );
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).toHaveBeenCalledWith("articleId", "locale");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(insertInDispositif).toHaveBeenCalledWith(
      req.body,
      "locale",
      dispoFromDB
    );
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "",
      "",
      "id_dispo",
      [],
      "locale"
    );
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(sendPublishedTradMailToStructure).toHaveBeenCalledWith(
      dispoFromDB,
      "locale"
    );
    expect(sendPublishedTradMailToTraductors).toHaveBeenCalledWith(
      ["userId1", "userId2"],
      "locale",
      "dispositif",
      "TI",
      "TM",
      "id",
      "userId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should validate trad in db, delete trad, update content in AT and updateLanguages avancement if admin", async () => {
    insertInDispositif.mockResolvedValueOnce({
      insertedDispositif: {
        typeContenu: "demarche",
        id: "id_demarche",
      },
      traductorIdsList: [],
    });

    await validateTranslations(
      { ...req, user: { roles: [{ nom: "Admin" }] } },
      res
    );
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).toHaveBeenCalledWith("articleId", "locale");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(insertInDispositif).toHaveBeenCalledWith(
      req.body,
      "locale",
      dispoFromDB
    );
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToTraductors).toHaveBeenCalledWith(
      [],
      "locale",
      "dispositif",
      "TI",
      "TM",
      "id",
      "userId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should validate trad in db, delete trad, update content in AT and updateLanguages avancement if expert", async () => {
    insertInDispositif.mockResolvedValueOnce({
      insertedDispositif: {
        typeContenu: "demarche",
        id: "id_demarche",
      },
      traductorIdsList: [],
    });

    await validateTranslations(
      { ...req, user: { roles: [{ nom: "ExpertTrad" }] } },
      res
    );
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).toHaveBeenCalledWith("articleId", "locale");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(insertInDispositif).toHaveBeenCalledWith(
      req.body,
      "locale",
      dispoFromDB
    );
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToTraductors).toHaveBeenCalledWith(
      [],
      "locale",
      "dispositif",
      "TI",
      "TM",
      "id",
      "userId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return a 500 if validateTradInDB throws", async () => {
    validateTradInDB.mockRejectedValueOnce(new Error("erreur"));

    await validateTranslations(
      { ...req, user: { roles: [{ nom: "ExpertTrad" }] } },
      res
    );
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).not.toHaveBeenCalled();
    expect(getDispositifByIdWithAllFields).not.toHaveBeenCalled();
    expect(insertInDispositif).not.toHaveBeenCalled();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToTraductors).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return a 500 if deleteTrads throws", async () => {
    deleteTradsInDB.mockRejectedValueOnce(new Error("erreur"));
    await validateTranslations(
      { ...req, user: { roles: [{ nom: "ExpertTrad" }] } },
      res
    );
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).toHaveBeenCalledWith("articleId", "locale");
    expect(getDispositifByIdWithAllFields).not.toHaveBeenCalled();
    expect(insertInDispositif).not.toHaveBeenCalled();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToTraductors).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return a 500 if insertDispositif throws", async () => {
    insertInDispositif.mockRejectedValueOnce(new Error("erreur"));
    await validateTranslations(
      { ...req, user: { roles: [{ nom: "ExpertTrad" }] } },
      res
    );
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).toHaveBeenCalledWith("articleId", "locale");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(insertInDispositif).toHaveBeenCalledWith(
      req.body,
      "locale",
      dispoFromDB
    );
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToTraductors).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 200 if addOrUpdateDispositifInContenusAirtable throws", async () => {
    insertInDispositif.mockResolvedValueOnce({
      insertedDispositif: {
        typeContenu: "dispositif",
        id: "id_dispo",
      },
      traductorIdsList: [],
    });
    updateLanguagesAvancement.mockRejectedValueOnce(new Error("erreur"));

    await validateTranslations(
      { ...req, user: { roles: [{ nom: "Admin" }] } },
      res
    );
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).toHaveBeenCalledWith("articleId", "locale");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(insertInDispositif).toHaveBeenCalledWith(
      req.body,
      "locale",
      dispoFromDB
    );
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "",
      "",
      "id_dispo",
      [],
      "locale"
    );
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(sendPublishedTradMailToStructure).toHaveBeenCalledWith(
      dispoFromDB,
      "locale"
    );
    expect(sendPublishedTradMailToTraductors).toHaveBeenCalledWith(
      [],
      "locale",
      "dispositif",
      "TI",
      "TM",
      "id",
      "userId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 500 if getDispositifByIdWithAllFields throws", async () => {
    insertInDispositif.mockResolvedValueOnce({
      insertedDispositif: {
        typeContenu: "dispositif",
        id: "id_dispo",
      },
      traductorIdsList: [],
    });
    getDispositifByIdWithAllFields.mockRejectedValueOnce(new Error("erreur"));

    await validateTranslations(
      { ...req, user: { roles: [{ nom: "Admin" }] } },
      res
    );
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).toHaveBeenCalledWith("articleId", "locale");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(insertInDispositif).not.toHaveBeenCalled();
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToStructure).not.toHaveBeenCalled();
    expect(sendPublishedTradMailToTraductors).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 200 if sendPublishedTradMailToStructure throws", async () => {
    insertInDispositif.mockResolvedValueOnce({
      insertedDispositif: {
        typeContenu: "dispositif",
        id: "id_dispo",
      },
      traductorIdsList: [],
    });
    sendPublishedTradMailToStructure.mockRejectedValueOnce(
      new Error("erreur1")
    );
    getDispositifByIdWithAllFields.mockResolvedValueOnce(dispoFromDB);

    await validateTranslations(
      { ...req, user: { roles: [{ nom: "Admin" }] } },
      res
    );
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).toHaveBeenCalledWith("articleId", "locale");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(insertInDispositif).toHaveBeenCalledWith(
      req.body,
      "locale",
      dispoFromDB
    );
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "",
      "",
      "id_dispo",
      [],
      "locale"
    );
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(sendPublishedTradMailToStructure).toHaveBeenCalledWith(
      dispoFromDB,
      "locale"
    );
    expect(sendPublishedTradMailToTraductors).toHaveBeenCalledWith(
      [],
      "locale",
      "dispositif",
      "TI",
      "TM",
      "id",
      "userId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
