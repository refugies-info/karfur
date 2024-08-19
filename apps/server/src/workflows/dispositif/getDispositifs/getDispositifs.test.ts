// @ts-nocheck
import getDispositifs from "./getDispositifs";
// import { getDispositifArray } from "../../../modules/dispositif/dispositif.repository";

/* jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getDispositifArray: jest.fn(),
}));

jest.mock("../../../controllers/dispositif/functions", () => ({
  turnToLocalized: jest.fn(),
  turnJSONtoHTML: jest.fn(),
})); */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("getDispositifs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should call getDispositifsArray and return correct result if one content has a zone d'action and an other not", async () => {
    getDispositifArray.mockResolvedValue(dispositifs);
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query } };
    await getDispositifs[1](req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query, { mainSponsor: 1, needs: 1, lastModificationDate: 1 }, "mainSponsor", 0, {});

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
    await getDispositifs[1](req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query, { mainSponsor: 1, needs: 1, lastModificationDate: 1 }, "mainSponsor", 0, {});

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
    await getDispositifs[1](req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query, { mainSponsor: 1, needs: 1, lastModificationDate: 1 }, "mainSponsor", 0, {});

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
  it("should call getDispositifsArray with right parameters", async () => {
    getDispositifArray.mockResolvedValue(dispositifs);
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query, locale: "en", limit: 12, sort: "publishedAt" } };
    await getDispositifs[1](req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query, { mainSponsor: 1, needs: 1, lastModificationDate: 1 }, "mainSponsor", 12, { "publishedAt": -1 });

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
    await getDispositifs[1](req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query, { mainSponsor: 1, needs: 1, lastModificationDate: 1 }, "mainSponsor", 0, {});

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
    await getDispositifs[1](req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query, { mainSponsor: 1, needs: 1, lastModificationDate: 1 }, "mainSponsor", 0, {});

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
    await getDispositifs[1](req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query, { mainSponsor: 1, needs: 1, lastModificationDate: 1 }, "mainSponsor", 0, {});

    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif1, "en");

    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu1);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
