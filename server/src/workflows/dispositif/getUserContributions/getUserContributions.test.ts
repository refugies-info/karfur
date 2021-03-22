// @ts-nocheck
import { getUserContributions } from "./getUserContributions";
import { getDispositifsWithCreatorId } from "../../../modules/dispositif/dispositif.repository";

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getDispositifsWithCreatorId: jest.fn(),
}));
type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getUserContributions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    const req = { fromSite: false };
    await getUserContributions(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should call getDispositifsWithCreatorId and format dispo ", async () => {
    const dispo1 = { titreInformatif: "TI", status: "status" };
    const dispo2 = {
      titreInformatif: "TI2",
      status: "status2",
      mainSponsor: { nom: "sponsor" },
      merci: [{ _id: 1 }, { _id: 2 }],
    };

    getDispositifsWithCreatorId.mockResolvedValueOnce([
      { toJSON: () => dispo1 },
      { toJSON: () => dispo2 },
    ]);

    const req = { fromSite: true, userId: "userId" };
    await getUserContributions(req, res);
    const neededFields = {
      titreInformatif: 1,
      titreMarque: 1,
      typeContenu: 1,
      mainSponsor: 1,
      nbVues: 1,
      status: 1,
      merci: 1,
    };
    expect(getDispositifsWithCreatorId).toHaveBeenCalledWith(
      "userId",
      neededFields
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [
        {
          titreInformatif: "TI",
          status: "status",
          nbMercis: 0,
          mainSponsor: null,
        },
        {
          titreInformatif: "TI2",
          status: "status2",
          mainSponsor: "sponsor",
          nbMercis: 2,
        },
      ],
    });
  });

  it("should throw a 500 if getDispositifsWithCreatorId throws", async () => {
    getDispositifsWithCreatorId.mockRejectedValueOnce(new Error("erreur"));

    const req = { fromSite: true, userId: "userId" };
    await getUserContributions(req, res);
    const neededFields = {
      titreInformatif: 1,
      titreMarque: 1,
      typeContenu: 1,
      mainSponsor: 1,
      nbVues: 1,
      status: 1,
      merci: 1,
    };
    expect(getDispositifsWithCreatorId).toHaveBeenCalledWith(
      "userId",
      neededFields
    );
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
