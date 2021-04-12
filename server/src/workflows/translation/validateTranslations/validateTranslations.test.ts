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

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

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

describe("validateTranslations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();
  it("should return 405 if not from site", async () => {
    const req = {};
    await validateTranslations(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true };
    await validateTranslations(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true, body: { translatedText: "text" } };
    await validateTranslations(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if invalid request", async () => {
    const req = { fromSite: true, body: { articleId: "text" } };
    await validateTranslations(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 401 if not admin or expert", async () => {
    const req = {
      fromSite: true,
      body: { articleId: "id", translatedText: "text" },
      user: { roles: [] },
    };
    await validateTranslations(req, res);
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
  it("should validate trad in db, delete trad, update content in AT and updateLanguages avancement if expert", async () => {
    insertInDispositif.mockResolvedValueOnce({
      typeContenu: "dispositif",
      id: "id_dispo",
    });
    getDispositifByIdWithAllFields.mockResolvedValue("initialDispo");

    await validateTranslations(req, res);
    expect(validateTradInDB).toHaveBeenCalledWith("id", "userId");
    expect(deleteTradsInDB).toHaveBeenCalledWith("articleId", "locale");
    expect(getDispositifByIdWithAllFields).toHaveBeenCalledWith("articleId");
    expect(insertInDispositif).toHaveBeenCalledWith(
      req.body,
      "locale",
      "initialDispo"
    );
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "",
      "",
      "id_dispo",
      [],
      "locale"
    );
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should validate trad in db, delete trad, update content in AT and updateLanguages avancement if admin", async () => {
    insertInDispositif.mockResolvedValueOnce({
      typeContenu: "dispositif",
      id: "id_dispo",
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
      "initialDispo"
    );
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "",
      "",
      "id_dispo",
      [],
      "locale"
    );
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should validate trad in db, delete trad, update content in AT and updateLanguages avancement if admin", async () => {
    insertInDispositif.mockResolvedValueOnce({
      typeContenu: "demarche",
      id: "id_demarche",
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
      "initialDispo"
    );
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should validate trad in db, delete trad, update content in AT and updateLanguages avancement if expert", async () => {
    insertInDispositif.mockResolvedValueOnce({
      typeContenu: "demarche",
      id: "id_demarche",
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
      "initialDispo"
    );
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
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
      "initialDispo"
    );
    expect(addOrUpdateDispositifInContenusAirtable).not.toHaveBeenCalled();
    expect(updateLanguagesAvancement).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 200 if addOrUpdateDispositifInContenusAirtable throws", async () => {
    insertInDispositif.mockResolvedValueOnce({
      typeContenu: "dispositif",
      id: "id_dispo",
    });
    addOrUpdateDispositifInContenusAirtable.mockRejectedValueOnce(
      new Error("erreur")
    );

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
      "initialDispo"
    );
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "",
      "",
      "id_dispo",
      [],
      "locale"
    );
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 if addOrUpdateDispositifInContenusAirtable throws", async () => {
    insertInDispositif.mockResolvedValueOnce({
      typeContenu: "dispositif",
      id: "id_dispo",
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
      "initialDispo"
    );
    expect(addOrUpdateDispositifInContenusAirtable).toHaveBeenCalledWith(
      "",
      "",
      "id_dispo",
      [],
      "locale"
    );
    expect(updateLanguagesAvancement).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 500 if getDispositifByIdWithAllFields throws", async () => {
    insertInDispositif.mockResolvedValueOnce({
      typeContenu: "dispositif",
      id: "id_dispo",
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
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
