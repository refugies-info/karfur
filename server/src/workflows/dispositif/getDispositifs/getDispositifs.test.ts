// @ts-nocheck
import { getDispositifs } from "./getDispositifs";
import { getDispositifArray } from "../../../modules/dispositif/dispositif.repository";
import {
  fakeContenuWithoutZoneDAction,
  fakeContenuWithZoneDAction,
} from "../../../__fixtures__/dispositifs";
import {
  turnToLocalized,
  turnJSONtoHTML,
} from "../../../controllers/dispositif/functions";

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getDispositifArray: jest.fn(),
}));

jest.mock("../../../controllers/dispositif/functions", () => ({
  turnToLocalized: jest.fn(),
  turnJSONtoHTML: jest.fn(),
}));
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

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

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
