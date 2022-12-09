//@ts-nocheck
import { getStatistics } from "./getStatistics";
import { getNbStructures } from "../../../modules/structure/structure.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/structure/structure.repository", () => ({
  getNbStructures: jest.fn().mockResolvedValue(12),
}));

const req = {};

describe("getStatistics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct result", async () => {
    const res = mockResponse();
    await getStatistics(req, res);
    expect(getNbStructures).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbStructures: 12
      }
    });
  });

  it("should return a 500 if getNbStructures throws ", async () => {
    getNbStructures.mockRejectedValueOnce(
      new Error("error")
    );

    const res = mockResponse();
    await getStatistics(req, res);
    expect(getNbStructures).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
});
