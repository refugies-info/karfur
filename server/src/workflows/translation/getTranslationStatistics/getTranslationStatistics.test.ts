//@ts-nocheck
/* import getStatistics from "./getStatistics";
import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository"; */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
/*
jest.mock("../../../modules/users/users.repository", () => ({
  getAllUsersFromDB: jest.fn().mockResolvedValue([
    { _id: 1, roles: [{ RoleName.USER }], selectedLanguages: [], last_connected: "2022-12-01" },
    {
      _id: 2,
      roles: [{ RoleName.USER }, { nom: "Trad" }],
      selectedLanguages: [{ _id: "en" }, { _id: "ru" }],
      last_connected: "2022-12-01",
    },
    {
      _id: 3,
      roles: [{ RoleName.USER }, { nom: "Trad" }],
      selectedLanguages: [{ _id: "en" }],
      last_connected: "2022-11-15",
    },
    {
      _id: 4,
      roles: [{ RoleName.USER }, { nom: "Trad" }],
      selectedLanguages: [{ _id: "ru" }],
      last_connected: "2022-12-01",
    },
    {
      _id: 4,
      roles: [{ RoleName.USER }, { nom: "Contrib" }],
      selectedLanguages: [{ _id: "ru" }],
      last_connected: "2022-12-01",
    },
    {
      _id: 5,
      roles: [{ RoleName.USER }, { nom: "ExpertTrad" }],
      selectedLanguages: [{ _id: "en" }],
      last_connected: "2022-12-01",
    },
    {
      _id: 6,
      roles: [{ RoleName.USER }, { nom: "Admin" }],
      selectedLanguages: [{ _id: "en" }],
      last_connected: "2022-12-01",
    },
  ]),
}));
jest.mock("../../../modules/langues/langues.repository", () => ({
  getActiveLanguagesFromDB: jest.fn().mockResolvedValue([
    {
      _id: "en",
      i18nCode: "en",
    },
    {
      _id: "ru",
      i18nCode: "ru",
    },
    {
      _id: "uk",
      i18nCode: "uk",
    },
    {
      _id: "fr",
      i18nCode: "fr",
    },
  ]),
})); */

const req = { query: {} };

describe.skip("getStatistics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return nbTranslators facet", async () => {
    const res = mockResponse();
    global.Date.now = jest.fn(() => new Date("2022-12-28T10:20:30Z").getTime());
    await getStatistics[1]({ query: { facets: ["nbTranslators"] } }, res);
    expect(getActiveLanguagesFromDB).toHaveBeenCalled();
    expect(getAllUsersFromDB).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbTranslators: 3,
      },
    });
  });

  it("should return nbTranslators and nbWordsTranslated facets", async () => {
    const res = mockResponse();
    global.Date.now = jest.fn(() => new Date("2022-12-28T10:20:30Z").getTime());
    await getStatistics[1]({ query: { facets: ["nbTranslators", "nbWordsTranslated"] } }, res);
    expect(getActiveLanguagesFromDB).toHaveBeenCalled();
    expect(getAllUsersFromDB).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbTranslators: 3,
        nbWordsTranslated: 52,
      },
    });
  });

  it("should return all facets", async () => {
    const res = mockResponse();
    global.Date.now = jest.fn(() => new Date("2022-12-28T10:20:30Z").getTime());
    await getStatistics[1](req, res);
    expect(getActiveLanguagesFromDB).toHaveBeenCalled();
    expect(getAllUsersFromDB).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbTranslators: 3,
        nbRedactors: 1,
        nbWordsTranslated: 52,
        nbActiveTranslators: [
          { languageId: "en", count: 1 },
          { languageId: "ru", count: 2 },
          { languageId: "uk", count: 0 },
        ],
      },
    });
  });

  it("should return a 500 if getActiveLanguagesFromDB throws ", async () => {
    getActiveLanguagesFromDB.mockRejectedValueOnce(new Error("error"));

    const res = mockResponse();
    await getStatistics[1](req, res);
    expect(getActiveLanguagesFromDB).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
  it("should return a 500 if getAllUsersFromDB throws ", async () => {
    getAllUsersFromDB.mockRejectedValueOnce(new Error("error"));

    const res = mockResponse();
    await getStatistics[1](req, res);
    expect(getAllUsersFromDB).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
  it("should return a 500 if getNbWordsTranslated throws ", async () => {
    // getNbWordsTranslated.mockRejectedValueOnce(
    //   new Error("error")
    // );

    const res = mockResponse();
    await getStatistics[1](req, res);
    // expect(getNbWordsTranslated).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
});
