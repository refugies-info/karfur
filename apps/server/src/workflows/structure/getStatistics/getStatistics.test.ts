//@ts-nocheck
import { getNbStructures, getStructuresFromDB } from "~/modules/structure/structure.repository";
import getStatistics from "./getStatistics";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

/* jest.mock("../../../modules/structure/structure.repository", () => ({
  getNbStructures: jest.fn().mockResolvedValue(12),
  getStructuresFromDB: jest.fn()
})); */

const req = { query: {} };

describe.skip("getStatistics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return nbStructures facet", async () => {
    const res = mockResponse();

    await getStatistics[1]({ query: { facets: ["nbStructures"] } }, res);
    expect(getNbStructures).toHaveBeenCalled();
    expect(getStructuresFromDB).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbStructures: 12,
      },
    });
  });

  it("should return nbStructures and nbCDA facets", async () => {
    const res = mockResponse();

    getStructuresFromDB.mockResolvedValueOnce([
      {
        membres: [
          { userId: 1, roles: ["administrateur"] },
          { userId: 2, roles: ["administrateur", "contributeur"] },
          { userId: 3, roles: ["contributeur"] },
        ],
      },
      {
        // ok if no members
      },
      {
        membres: [{ userId: 1, roles: ["contributeur"] }],
      },
      {
        membres: [
          { userId: 1, roles: ["administrateur"] }, // same id, don't count
          { userId: 4, roles: ["administrateur"] },
        ],
      },
    ]);

    await getStatistics[1]({ query: { facets: ["nbStructures", "nbCDA"] } }, res);
    expect(getNbStructures).toHaveBeenCalled();
    expect(getStructuresFromDB).toHaveBeenCalledTimes(1);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbStructures: 12,
        nbCDA: 3,
      },
    });
  });

  it("should return all facets", async () => {
    const res = mockResponse();
    getStructuresFromDB.mockResolvedValueOnce([
      {
        membres: [
          { userId: 1, roles: ["administrateur"] },
          { userId: 2, roles: ["administrateur", "contributeur"] },
          { userId: 3, roles: ["contributeur"] },
        ],
      },
    ]);

    getStructuresFromDB.mockResolvedValueOnce([
      {
        membres: [
          { userId: 1, roles: ["administrateur"] },
          { userId: 2, roles: ["administrateur", "contributeur"] },
          { userId: 3, roles: ["contributeur"] },
        ],
      },
      {
        // ok if no members
      },
      {
        membres: [{ userId: 1, roles: ["contributeur"] }],
      },
      {
        membres: [
          { userId: 1, roles: ["administrateur"] }, // same id, don't count
          { userId: 4, roles: ["administrateur"] },
        ],
      },
    ]);

    await getStatistics[1](req, res);
    expect(getNbStructures).toHaveBeenCalled();
    expect(getStructuresFromDB).toHaveBeenCalledTimes(2);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      data: {
        nbStructures: 12,
        nbCDA: 3,
        nbStructureAdmins: 3,
      },
    });
  });

  it("should return a 500 if getNbStructures throws ", async () => {
    getNbStructures.mockRejectedValueOnce(new Error("error"));

    const res = mockResponse();
    await getStatistics[1](req, res);
    expect(getNbStructures).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ text: "Erreur" });
  });
});
