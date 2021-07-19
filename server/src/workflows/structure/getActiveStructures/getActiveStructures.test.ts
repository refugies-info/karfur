// @ts-nocheck
import { getActiveStructures } from "./getActiveStructures";
import { getStructuresFromDB } from "../../../modules/structure/structure.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../../modules/structure/structure.repository", () => ({
  getStructuresFromDB: jest
    .fn()
    .mockResolvedValue([{ id: "id1" }, { id: "id2" }]),
}));

describe("getActiveStructures", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call getStructuresFromDB and return a 200", async () => {
    const res = mockResponse();
    await getActiveStructures({}, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1, departments: 1, structureTypes: 1 },
      true
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ id: "id1" }, { id: "id2" }],
    });
  });

  it("should return a 500 if getStructuresFromDB throw ", async () => {
    getStructuresFromDB.mockRejectedValueOnce(new Error("error"));
    const res = mockResponse();
    await getActiveStructures({}, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1, departments: 1, structureTypes: 1 },
      true
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
