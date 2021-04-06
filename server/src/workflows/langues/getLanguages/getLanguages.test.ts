// @ts-nocheck
import { getLanguages } from "./getLanguages";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";

jest.mock("../../../modules/langues/langues.repository", () => ({
  getActiveLanguagesFromDB: jest.fn(),
}));

type MockResponse = { json: any; status: any };

const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const languages = [
  { langueFr: "en", avancementTrad: 0.8 },
  { langueFr: "ar", avancementTrad: 1.2 },
];

describe("getLanguages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call getActiveLanguages", async () => {
    getActiveLanguagesFromDB.mockResolvedValueOnce(languages);
    const res = mockResponse();
    await getLanguages({}, res);
    expect(getActiveLanguagesFromDB).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [
        { langueFr: "en", avancementTrad: 0.8 },
        { langueFr: "ar", avancementTrad: 1 },
      ],
    });
  });

  it("should call getActiveLanguages and case throw", async () => {
    getActiveLanguagesFromDB.mockRejectedValueOnce(new Error("erreur"));
    const res = mockResponse();
    await getLanguages({}, res);
    expect(getActiveLanguagesFromDB).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
