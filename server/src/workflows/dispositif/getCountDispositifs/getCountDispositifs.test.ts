//@ts-nocheck
/* import getStatistics from "./getStatistics";
import { getNbMercis, getNbVues, getNbFiches, getNbUpdatedRecently } from "../../../modules/dispositif/dispositif.repository";
 */
type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

/* jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getNbMercis: jest.fn().mockResolvedValue([{ _id: null, mercis: 4072 }]),
  getNbVues: jest.fn().mockResolvedValue([{ _id: null, nbVues: 175201, nbVuesMobile: 85741 }]),
  getNbFiches: jest.fn().mockResolvedValue({ nbDispositifs: 13, nbDemarches: 14 }),
  getNbUpdatedRecently: jest.fn().mockResolvedValue(12)
}));
 */
const req = { query: {} };

describe.skip("getStatistics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return nbVues facet", async () => {
    const res = mockResponse();
    await getStatistics[1]({ query: { facets: ["nbVues"] } }, res);
    expect(getNbMercis).not.toHaveBeenCalled();
    expect(getNbVues).toHaveBeenCalled();
    expect(getNbFiches).not.toHaveBeenCalled();
    expect(getNbUpdatedRecently).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbVues: 175201,
        nbVuesMobile: 85741,
      }
    });
  });

  it("should return nbVues and nbUpdated facets", async () => {
    const res = mockResponse();
    await getStatistics[1]({ query: { facets: ["nbVues", "nbUpdatedRecently"] } }, res);
    expect(getNbMercis).not.toHaveBeenCalled();
    expect(getNbVues).toHaveBeenCalled();
    expect(getNbFiches).not.toHaveBeenCalled();
    expect(getNbUpdatedRecently).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbVues: 175201,
        nbVuesMobile: 85741,
        nbUpdatedRecently: 12
      }
    });
  });

  it("should return nb content and nbUpdated facets", async () => {
    const res = mockResponse();
    await getStatistics[1]({ query: { facets: ["nbDispositifs", "nbUpdatedRecently"] } }, res);
    expect(getNbMercis).not.toHaveBeenCalled();
    expect(getNbVues).not.toHaveBeenCalled();
    expect(getNbFiches).toHaveBeenCalled();
    expect(getNbUpdatedRecently).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbDispositifs: 13,
        nbDemarches: 14,
        nbUpdatedRecently: 12
      }
    });
  });

  it("should return all facets", async () => {
    const res = mockResponse();
    await getStatistics[1](req, res);
    expect(getNbMercis).toHaveBeenCalled();
    expect(getNbVues).toHaveBeenCalled();
    expect(getNbFiches).toHaveBeenCalled();
    expect(getNbUpdatedRecently).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbMercis: 4072,
        nbVues: 175201,
        nbVuesMobile: 85741,
        nbDispositifs: 13,
        nbDemarches: 14,
        nbUpdatedRecently: 12
      }
    });
  });

  it("should return a 500 if getNbMercis throws ", async () => {
    getNbMercis.mockRejectedValueOnce(
      new Error("error")
    );

    const res = mockResponse();
    await getStatistics[1](req, res);
    expect(getNbMercis).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });

  it("should return a 500 if getNbVues throws ", async () => {
    getNbVues.mockRejectedValueOnce(
      new Error("error")
    );

    const res = mockResponse();
    await getStatistics[1](req, res);
    expect(getNbVues).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
});
