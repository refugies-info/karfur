// @ts-nocheck
import { getDispositifs } from "../dispositif.service";
import { getDispositifArray } from "../dispositif.repository";
import { fakeContenu } from "../../../__fixtures__/dispositifs";
import { turnToLocalized, turnJSONtoHTML } from "../functions";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../dispositif.repository", () => ({
  getDispositifArray: jest.fn(),
}));

jest.mock("../functions", () => ({
  turnToLocalized: jest.fn(),
  turnJSONtoHTML: jest.fn(),
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

  it("should call getDispositifsArray", async () => {
    getDispositifArray.mockResolvedValue([
      {
        id: "id1",
        contenu: fakeContenu,
      },
    ]);
    const res = mockResponse();
    const query = { status: "Actif" };
    const req = { body: { query } };
    await getDispositifs(req, res);
    expect(getDispositifArray).toHaveBeenCalledWith(query);
    const contenu = [
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
          [],
          [],
          [],
          [],
        ],
      },
    ];
    const adaptedDispositif = {
      id: "id1",
      contenu,
    };
    expect(turnToLocalized).toHaveBeenCalledWith(adaptedDispositif, "fr");
    expect(turnJSONtoHTML).toHaveBeenCalledWith(contenu);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "Succès",
      data: [adaptedDispositif],
    });
  });
});
