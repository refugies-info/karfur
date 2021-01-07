// @ts-nocheck
import {
  getDispositifs,
  getAllDispositifs,
  updateDispositifStatus,
  modifyDispositifMainSponsor,
  updateDispositifAdminComments,
  getNbDispositifsByRegion,
} from "../dispositif.service";
import {
  getDispositifArray,
  getDispositifsFromDB,
  updateDispositifInDB,
  getActiveDispositifsFromDBWithoutPopulate,
} from "../dispositif.repository";
import {
  fakeContenuWithoutZoneDAction,
  fakeContenuWithZoneDAction,
  fakeContenuWithEmptyZoneDAction,
} from "../../../__fixtures__/dispositifs";
import {
  turnToLocalized,
  turnJSONtoHTML,
  turnToLocalizedTitles,
} from "../functions";
import { updateAssociatedDispositifsInStructure } from "../../../models/structure/structure.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../models/structure/structure.repository", () => ({
  updateAssociatedDispositifsInStructure: jest.fn(),
}));
jest.mock("../dispositif.repository", () => ({
  getDispositifArray: jest.fn(),
  getDispositifsFromDB: jest.fn(),
  updateDispositifInDB: jest.fn(),
  getActiveDispositifsFromDBWithoutPopulate: jest.fn(),
}));

jest.mock("../functions", () => ({
  turnToLocalized: jest.fn(),
  turnJSONtoHTML: jest.fn(),
  turnToLocalizedTitles: jest.fn(),
}));

const contenu1 = [
  {},
  {
    children: [
      {
        type: "card",
        isFakeContent: false,
        title: "Zone d'action",
        titleIcon: "pin-outline",
        typeIcon: "eva",
        departments: ["All", "68 - Haut-Rhin"],
        free: true,
        contentTitle: "Sélectionner",
        editable: false,
      },
      {},
      {},
      {},
      {},
    ],
  },
];
const contenu2 = [
  {},
  {
    children: [{}, {}, {}, {}],
  },
];
const adaptedDispositif1 = {
  _id: "id1",
  contenu: contenu1,
};
const adaptedDispositif2 = {
  _id: "id2",
  contenu: contenu2,
};
const dispositifs = [
  {
    _id: "id1",
    contenu: fakeContenuWithZoneDAction,
  },
  {
    _id: "id2",
    contenu: fakeContenuWithoutZoneDAction,
  },
];

const dispositifsFigures = dispositifs.concat([
  { _id: "id3", contenu: fakeContenuWithEmptyZoneDAction },
]);

describe("getDispositifs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if no body", async () => {
    const res = mockResponse();
    const req = {};
    await getDispositifs(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no query in body", async () => {
    const res = mockResponse();
    const req = { body: {} };
    await getDispositifs(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should call getDispositifsArray and return correct result if one content has a zone d'action and an other not", async () => {
    getDispositifArray.mockResolvedValue([
      {
        _id: "id1",
        contenu: fakeContenuWithZoneDAction,
      },
      {
        _id: "id2",
        contenu: fakeContenuWithoutZoneDAction,
      },
    ]);
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "fr");
    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif2, "fr");

    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu1);
    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu2);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [adaptedDispositif1, adaptedDispositif2],
    });
  });

  it("should call getDispositifsArray and return correct result if one content has a zone d'action and an other not", async () => {
    getDispositifArray.mockResolvedValue(dispositifs);
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "fr");
    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif2, "fr");

    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu1);
    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu2);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [adaptedDispositif1, adaptedDispositif2],
    });
  });
  it("should call getDispositifsArray and return correct result if one content has a zone d'action and an other not and locale in query", async () => {
    getDispositifArray.mockResolvedValue(dispositifs);
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query, locale: "en" } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "en");
    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif2, "en");

    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu1);
    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu2);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [adaptedDispositif1, adaptedDispositif2],
    });
  });

  it("should return a 500 if getDispositifArray throws", async () => {
    getDispositifArray.mockRejectedValueOnce(new Error("error"));
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query, locale: "en" } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).not.toHaveBeenCalled();
    expect(turnToLocalized).not.toHaveBeenCalled();

    expect(turnJSONtoHTML).not.toHaveBeenCalled();
    expect(turnJSONtoHTML).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should return a 500 if turnToLocalized throws", async () => {
    getDispositifArray.mockResolvedValue(dispositifs);
    turnToLocalized.mockImplementationOnce(() => {
      throw new Error("TEST");
    });
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query, locale: "en" } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "en");

    expect(turnJSONtoHTML).not.toHaveBeenCalled();
    expect(turnJSONtoHTML).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should return a 500 if turnJSONToHTML throws", async () => {
    getDispositifArray.mockResolvedValue(dispositifs);
    turnJSONtoHTML.mockImplementationOnce(() => {
      throw new Error("TEST");
    });
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query, locale: "en" } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);

    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "en");

    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu1);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});

describe("getAllispositifs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    updatedAt: 1,
    status: 1,
    typeContenu: 1,
    created_at: 1,
    publishedAt: 1,
    adminComments: 1,
    adminProgressionStatus: 1,
    adminPercentageProgressionStatus: 1,
    lastAdminUpdate: 1,
  };

  const dispositifsToJson = [
    {
      toJSON: () => ({
        _id: "id1",
        mainSponsor: {
          _id: "id",
          nom: "nom",
          status: "Actif",
          email: "email",
          picture: { secure_url: "secure_url_sponsor" },
        },
        creatorId: {
          username: "creator",
          _id: "creatorId",
          picture: { secure_url: "secure_url" },
          password: "test",
        },
      }),
    },
    { toJSON: () => ({ _id: "id2" }) },
  ];

  const adaptedDispositif1 = {
    _id: "id1",
    mainSponsor: {
      _id: "id",
      nom: "nom",
      status: "Actif",
      picture: { secure_url: "secure_url_sponsor" },
    },
    creatorId: {
      username: "creator",
      _id: "creatorId",
      picture: { secure_url: "secure_url" },
    },
  };
  const adaptedDispositif2 = {
    _id: "id2",
    mainSponsor: "",
    creatorId: null,
  };
  it("should call getDispositifsFromDB", async () => {
    getDispositifsFromDB.mockResolvedValue(dispositifsToJson);
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).toHaveBeenCalledWith(
      adaptedDispositif1,
      "fr"
    );
    expect(turnToLocalizedTitles).toHaveBeenCalledWith(
      adaptedDispositif2,
      "fr"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [adaptedDispositif1, adaptedDispositif2],
    });
  });

  it("should call getDispositifsFromDB and return a 500 if getDispositifsFromDB throws", async () => {
    getDispositifsFromDB.mockRejectedValue(new Error("error"));
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should call getDispositifsFromDB and return a 500 if dispositif has no json", async () => {
    getDispositifsFromDB.mockResolvedValue([{ id: "id1" }, { id: "id2" }]);
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(turnToLocalizedTitles).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });

  it("should call getDispositifsFromDB and return a 500 if dispositif has no json", async () => {
    getDispositifsFromDB.mockResolvedValue(dispositifsToJson);
    turnToLocalizedTitles.mockImplementationOnce(() => {
      throw new Error("TEST");
    });
    const res = mockResponse();
    await getAllDispositifs({}, res);
    expect(getDispositifsFromDB).toHaveBeenCalledWith(neededFields);
    expect(turnToLocalizedTitles).toHaveBeenCalledWith(
      adaptedDispositif1,
      "fr"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});

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
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });
});

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

describe("updateDispositifAdminComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 if not fromSite", async () => {
    const req = { body: {} };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });

  it("should return 400 if no body", async () => {
    const req = { fromSite: true };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no query", async () => {
    const req = { fromSite: true, body: { test: "test" } };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no dispositifId", async () => {
    const req = { fromSite: true, body: { query: { test: "test" } } };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should call updateDispositifInDB", async () => {
    const req = {
      fromSite: true,
      body: {
        query: {
          dispositifId: "id",
          adminComments: "adminComments",
          adminProgressionStatus: "adminProgressionStatus",
          adminPercentageProgressionStatus: "adminPercentageProgressionStatus",
        },
      },
    };

    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      adminComments: "adminComments",
      adminProgressionStatus: "adminProgressionStatus",
      adminPercentageProgressionStatus: "adminPercentageProgressionStatus",
      lastAdminUpdate: date,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });
});

describe("updateDispositifAdminComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call getActiveDispositifsFromDBWithoutPopulate and return correct result", async () => {
    getActiveDispositifsFromDBWithoutPopulate.mockResolvedValue(
      dispositifsFigures
    );
    const res = mockResponse();
    await getNbDispositifsByRegion({}, res);
    expect(getActiveDispositifsFromDBWithoutPopulate).toHaveBeenCalledWith({
      contenu: 1,
    });
    const result = [
      {
        region: "Auvergne-Rhône-Alpes",
        nbDispositifs: 0,
        nbDepartments: 12,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Hauts-de-France",
        nbDispositifs: 0,
        nbDepartments: 5,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Provence-Alpes-Côte d'Azur",
        nbDispositifs: 0,
        nbDepartments: 6,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Grand Est",
        nbDispositifs: 1,
        nbDepartments: 10,
        nbDepartmentsWithDispo: 1,
      },
      {
        region: "Occitanie",
        nbDispositifs: 0,
        nbDepartments: 13,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Normandie",
        nbDispositifs: 0,
        nbDepartments: 5,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Nouvelle-Aquitaine",
        nbDispositifs: 0,
        nbDepartments: 12,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Centre-Val de Loire",
        nbDispositifs: 0,
        nbDepartments: 6,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Bourgogne-Franche-Comté",
        nbDispositifs: 0,
        nbDepartments: 8,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Bretagne",
        nbDispositifs: 0,
        nbDepartments: 4,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Corse",
        nbDispositifs: 0,
        nbDepartments: 2,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Pays de la Loire",
        nbDispositifs: 0,
        nbDepartments: 5,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "Île-de-France",
        nbDispositifs: 0,
        nbDepartments: 8,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "No geoloc",
        nbDispositifs: 2,
        nbDepartments: 0,
        nbDepartmentsWithDispo: 0,
      },
      {
        region: "France",
        nbDispositifs: 1,
        nbDepartments: 0,
        nbDepartmentsWithDispo: 0,
      },
    ];
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        regionFigures: result,
        dispositifsWithoutGeoloc: ["id2", "id3"],
      },
    });
  });

  it("should return a 500 if getActiveDispositifsFromDBWithoutPopulate throws ", async () => {
    getActiveDispositifsFromDBWithoutPopulate.mockRejectedValue(
      new Error("error")
    );

    const res = mockResponse();
    await getNbDispositifsByRegion({}, res);
    expect(getActiveDispositifsFromDBWithoutPopulate).toHaveBeenCalledWith({
      contenu: 1,
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
});
