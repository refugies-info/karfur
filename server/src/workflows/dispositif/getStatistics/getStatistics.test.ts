//@ts-nocheck
import { getStatistics } from "./getStatistics";
import { getNbMercis, getNbVues } from "../../../modules/dispositif/dispositif.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getNbMercis: jest.fn().mockResolvedValue([{_id:null,mercis:4072}]),
  getNbVues: jest.fn().mockResolvedValue([{_id:null,nbVues:175201,nbVuesMobile:85741}]),
}));

describe("getStatistics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct result", async () => {
    const res = mockResponse();
    await getStatistics({}, res);
    expect(getNbMercis).toHaveBeenCalled();
    expect(getNbVues).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbMercis: 4072,
        nbVues: 175201,
        nbVuesMobile: 85741
      }
    });
  });

  it("should return a 500 if getNbMercis throws ", async () => {
    getNbMercis.mockRejectedValueOnce(
      new Error("error")
    );

    const res = mockResponse();
    await getStatistics({}, res);
    expect(getNbMercis).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });

  it("should return a 500 if getNbVues throws ", async () => {
    getNbVues.mockRejectedValueOnce(
      new Error("error")
    );

    const res = mockResponse();
    await getStatistics({}, res);
    expect(getNbVues).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
});
