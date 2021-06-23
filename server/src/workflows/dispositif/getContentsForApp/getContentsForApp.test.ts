import { getContentsForApp } from "./getContentsForApp";
import { getActiveContents } from "../../../modules/dispositif/dispositif.repository";

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getActiveContents: jest.fn(),
}));
type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getDispositifsWithTranslationAvancement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();
  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    avancement: 1,
  };

  it("should return 405 if not from site", async () => {
    const req = { fromSite: false };
    await getContentsForApp(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should return 400 if no query", async () => {
    const req = { fromSite: true };
    await getContentsForApp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if no locale inquery", async () => {
    const req = { fromSite: true, query: {} };
    await getContentsForApp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 200 when locale not fr", async () => {
    const contents = [{ titreInformatif: "ti", titreMarque: "TM" }];
    getActiveContents.mockResolvedValueOnce(contents);
    const req = { fromSite: true, query: { locale: "ar" } };
    await getContentsForApp(req, res);
    expect(getActiveContents).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: contents,
      dataFr: contents,
    });
  });

  it("should return 200 when locale is ar", async () => {
    const contentsInput = [
      {
        titreInformatif: { ar: "tI_ar", fr: "ti" },
        titreMarque: { ar: "TM_ar", fr: "tm" },
      },
    ];
    getActiveContents.mockResolvedValueOnce(contentsInput);
    const req = { fromSite: true, query: { locale: "ar" } };
    await getContentsForApp(req, res);
    expect(getActiveContents).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [{ titreInformatif: "tI_ar", titreMarque: "TM_ar" }],
      dataFr: [{ titreInformatif: "ti", titreMarque: "tm" }],
    });
  });

  it("should return 200 when locale is fr", async () => {
    const contentsInput = [
      {
        titreInformatif: { ar: "tI_ar", fr: "ti" },
        titreMarque: { ar: "TM_ar", fr: "tm" },
      },
    ];
    getActiveContents.mockResolvedValueOnce(contentsInput);
    const req = { fromSite: true, query: { locale: "fr" } };
    await getContentsForApp(req, res);
    expect(getActiveContents).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      dataFr: [{ titreInformatif: "ti", titreMarque: "tm" }],
    });
  });

  it("should return 500 if getActiveContents throw", async () => {
    getActiveContents.mockRejectedValueOnce(new Error("erreur"));
    const req = { fromSite: true, query: { locale: "ar" } };
    await getContentsForApp(req, res);
    expect(getActiveContents).toHaveBeenCalledWith(neededFields);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
