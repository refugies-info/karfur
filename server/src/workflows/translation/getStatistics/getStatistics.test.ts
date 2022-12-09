//@ts-nocheck
import { getStatistics } from "./getStatistics";
import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { getNbWordsTranslated } from "../../../modules/traductions/traductions.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/users/users.repository", () => ({
  getAllUsersFromDB: jest.fn().mockResolvedValue([
    { _id: 1, roles: [{ nom: "User" }], selectedLanguages: [], last_connected: "2022-12-01" },
    { _id: 2, roles: [{ nom: "User" }, { nom: "Trad" }], selectedLanguages: [{ _id: "en" }, { _id: "ru" }], last_connected: "2022-12-01" },
    { _id: 3, roles: [{ nom: "User" }, { nom: "Trad" }], selectedLanguages: [{ _id: "en" }], last_connected: "2022-11-15" },
    { _id: 4, roles: [{ nom: "User" }, { nom: "Trad" }], selectedLanguages: [{ _id: "ru" }], last_connected: "2022-12-01" },
    { _id: 5, roles: [{ nom: "User" }, { nom: "ExpertTrad" }], selectedLanguages: [{ _id: "en" }], last_connected: "2022-12-01" },
    { _id: 6, roles: [{ nom: "User" }, { nom: "Admin" }], selectedLanguages: [{ _id: "en" }], last_connected: "2022-12-01" },
  ]),
}));
jest.mock("../../../modules/traductions/traductions.repository", () => ({
  getNbWordsTranslated: jest.fn().mockResolvedValue([
    { wordsCount: 52 }
  ]),
}));
jest.mock("../../../modules/langues/langues.repository", () => ({
  getActiveLanguagesFromDB: jest.fn().mockResolvedValue([{
    _id: "en", i18nCode: "en"
  }, {
    _id: "ru", i18nCode: "ru"
  }, {
    _id: "uk", i18nCode: "uk"
  }, {
    _id: "fr", i18nCode: "fr"
  }]),
}));

const req = {};

describe("getStatistics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct result", async () => {
    const res = mockResponse();
    global.Date.now = jest.fn(() => new Date('2022-12-28T10:20:30Z').getTime())
    await getStatistics(req, res);
    expect(getActiveLanguagesFromDB).toHaveBeenCalled();
    expect(getAllUsersFromDB).toHaveBeenCalled();
    expect(getNbWordsTranslated).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbTranslators: 3,
        nbWordsTranslated: 52,
        nbActiveTranslators: [
          { languageId: "en", count: 1 },
          { languageId: "ru", count: 2 },
          { languageId: "uk", count: 0 },
        ]
      }
    });
  });

  it("should return a 500 if getActiveLanguagesFromDB throws ", async () => {
    getActiveLanguagesFromDB.mockRejectedValueOnce(
      new Error("error")
    );

    const res = mockResponse();
    await getStatistics(req, res);
    expect(getActiveLanguagesFromDB).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
  it("should return a 500 if getAllUsersFromDB throws ", async () => {
    getAllUsersFromDB.mockRejectedValueOnce(
      new Error("error")
    );

    const res = mockResponse();
    await getStatistics(req, res);
    expect(getAllUsersFromDB).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
  it("should return a 500 if getNbWordsTranslated throws ", async () => {
    getNbWordsTranslated.mockRejectedValueOnce(
      new Error("error")
    );

    const res = mockResponse();
    await getStatistics(req, res);
    expect(getNbWordsTranslated).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
});
