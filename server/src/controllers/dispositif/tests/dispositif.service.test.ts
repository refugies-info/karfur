// @ts-nocheck
import {
  getDispositifs,
  getAllDispositifs,
  updateDispositifStatus,
  modifyDispositifMainSponsor,
} from "../dispositif.service";
import {
  getDispositifArray,
  getDispositifsFromDB,
  updateDispositifStatusInDB,
  updateDispositifMainSponsorInDB,
} from "../dispositif.repository";
import {
  fakeContenuWithoutZoneDAction,
  fakeContenuWithZoneDAction,
} from "../../../__fixtures__/dispositifs";
import {
  turnToLocalized,
  turnJSONtoHTML,
  turnToLocalizedTitles,
} from "../functions";
import { updateAssociatedDispositifsInStructure } from "../../structure/structure.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../structure/structure.repository.ts", () => ({
  updateAssociatedDispositifsInStructure: jest.fn(),
}));
jest.mock("../dispositif.repository", () => ({
  getDispositifArray: jest.fn(),
  getDispositifsFromDB: jest.fn(),
  updateDispositifStatusInDB: jest.fn(),
  updateDispositifMainSponsorInDB: jest.fn(),
}));

jest.mock("../functions", () => ({
  turnToLocalized: jest.fn(),
  turnJSONtoHTML: jest.fn(),
  turnToLocalizedTitles: jest.fn(),
}));

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
        id: "id1",
        contenu: fakeContenuWithZoneDAction,
      },
      {
        id: "id2",
        contenu: fakeContenuWithoutZoneDAction,
      },
    ]);
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);
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
            departments: ["All"],
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
      id: "id1",
      contenu: contenu1,
    };
    const adaptedDispositif2 = {
      id: "id2",
      contenu: contenu2,
    };
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
          departments: ["All"],
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
    id: "id1",
    contenu: contenu1,
  };
  const adaptedDispositif2 = {
    id: "id2",
    contenu: contenu2,
  };

  const dispositifs = [
    {
      id: "id1",
      contenu: fakeContenuWithZoneDAction,
    },
    {
      id: "id2",
      contenu: fakeContenuWithoutZoneDAction,
    },
  ];

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
  };

  const dispositifsToJson = [
    {
      toJSON: () => ({
        id: "id1",
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
    { toJSON: () => ({ id: "id2" }) },
  ];

  const adaptedDispositif1 = {
    id: "id1",
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
    id: "id2",
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

    expect(updateDispositifStatusInDB).toHaveBeenCalledWith("id", {
      status: "En attente",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should return a 500 when updateDispositifStatusInDB throws", async () => {
    updateDispositifStatusInDB.mockRejectedValueOnce(new Error("error"));
    const req = {
      fromSite: true,
      body: { query: { dispositifId: "id", status: "En attente" } },
    };
    const res = mockResponse();
    await updateDispositifStatus(req, res);

    expect(updateDispositifStatusInDB).toHaveBeenCalledWith("id", {
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

    expect(updateDispositifStatusInDB).toHaveBeenCalledWith("id", {
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

  it("should call updateDispositifMainSponsorInDB and updateAssociatedDispositifsInStructure and return a 200 ", async () => {
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

    expect(updateDispositifMainSponsorInDB).toHaveBeenCalledWith(
      "dispositifId",
      { mainSponsor: "sponsorId", status: "En attente" }
    );
    expect(updateAssociatedDispositifsInStructure).toHaveBeenCalledWith(
      "dispositifId",
      "sponsorId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });

  it("should call updateDispositifMainSponsorInDB and return a 500 if updateDispositifMainSponsorInDB throws", async () => {
    updateDispositifMainSponsorInDB.mockRejectedValueOnce(new Error("error"));

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

    expect(updateDispositifMainSponsorInDB).toHaveBeenCalledWith(
      "dispositifId",
      { mainSponsor: "sponsorId", status: "En attente" }
    );
    expect(updateAssociatedDispositifsInStructure).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should call updateDispositifMainSponsorInDB and return a 500 if updateDispositifMainSponsorInDB throws", async () => {
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

    expect(updateDispositifMainSponsorInDB).toHaveBeenCalledWith(
      "dispositifId",
      { mainSponsor: "sponsorId", status: "Actif" }
    );
    expect(updateAssociatedDispositifsInStructure).toHaveBeenCalledWith(
      "dispositifId",
      "sponsorId"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur interne" });
  });

  it("should call updateDispositifMainSponsorInDB and updateAssociatedDispositifsInStructure and return a 200 ", async () => {
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

    expect(updateDispositifMainSponsorInDB).toHaveBeenCalledWith(
      "dispositifId",
      { mainSponsor: "sponsorId", status: "En attente" }
    );
    expect(updateAssociatedDispositifsInStructure).toHaveBeenCalledWith(
      "dispositifId",
      "sponsorId"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });
});
