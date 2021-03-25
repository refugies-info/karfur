// @ts-nocheck
import { modifyMembreRoleInStructures } from "./modifyMembreRoleInStructures";
import { checkRequestIsFromPostman } from "../../../libs/checkAuthorizations";
import {
  getStructuresFromDB,
  updateStructureInDB,
} from "../../../modules/structure/structure.repository";

jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromPostman: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../modules/structure/structure.repository", () => ({
  getStructuresFromDB: jest.fn(),
  updateStructureInDB: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("modifyMembreRoleInStructures", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();
  it("should return 404 if not from postman", async () => {
    checkRequestIsFromPostman.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_POSTMAN");
    });
    const req = { fromPostman: false };
    await modifyMembreRoleInStructures(req, res);
    expect(checkRequestIsFromPostman).toHaveBeenCalledWith(false);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  const structure1 = { _id: "id1", membres: [] };
  const structure2 = { _id: "id2" };
  const structure3 = {
    _id: "id3",
    membres: [
      { userId: "userID1", roles: ["administrateur"] },
      { userId: "userID2", roles: ["contributeur"] },
    ],
  };

  const structure4 = {
    _id: "id4",
    membres: [
      { roles: ["administrateur"] },
      { userId: "userID2", roles: ["contributeur"] },
    ],
  };

  const structure5 = {
    _id: "id5",
    membres: [
      { userId: "userID1", roles: [] },
      { userId: "userID2", roles: ["contributeur"] },
    ],
  };

  const structure6 = {
    _id: "id6",
    membres: [
      { userId: "userID1" },
      { userId: "userID2", roles: ["contributeur"] },
    ],
  };

  const structure7 = {
    _id: "id7",
    membres: [
      {
        userId: "userID1",
        roles: ["createur", "membre"],
      },
      { userId: "userID2", roles: ["contributeur"] },
    ],
  };

  const structures = [
    structure1,
    structure2,
    structure3,
    structure4,
    structure5,
    structure6,
    structure7,
  ];
  it("should getstructures", async () => {
    getStructuresFromDB.mockResolvedValueOnce(structures);
    const req = { fromPostman: false };
    await modifyMembreRoleInStructures(req, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith({}, { membres: 1 }, false);
    expect(updateStructureInDB).toHaveBeenCalledWith("id4", {
      membres: [{ userId: "userID2", roles: ["contributeur"] }],
    });
    expect(updateStructureInDB).toHaveBeenCalledWith("id5", {
      membres: [
        { userId: "userID1", roles: ["contributeur"] },
        { userId: "userID2", roles: ["contributeur"] },
      ],
    });
    expect(updateStructureInDB).toHaveBeenCalledWith("id6", {
      membres: [{ userId: "userID2", roles: ["contributeur"] }],
    });
    expect(updateStructureInDB).not.toHaveBeenCalledWith(
      "id3",
      expect.anything()
    );
    expect(updateStructureInDB).not.toHaveBeenCalledWith(
      "id2",
      expect.anything()
    );
    expect(updateStructureInDB).not.toHaveBeenCalledWith(
      "id1",
      expect.anything()
    );
    expect(updateStructureInDB).toHaveBeenCalledWith("id7", {
      membres: [
        {
          userId: "userID1",
          roles: ["createur", "contributeur"],
        },
        { userId: "userID2", roles: ["contributeur"] },
      ],
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      nbUpdated: 4,
      errors: [],
      updatedArray: [
        { structureId: "id4" },
        { structureId: "id5" },
        { structureId: "id6" },
        { structureId: "id7" },
      ],
    });
  });

  it("should getstructures and return errors if ", async () => {
    getStructuresFromDB.mockResolvedValueOnce([structure4, structure5]);
    updateStructureInDB.mockRejectedValueOnce(new Error("ERROR"));
    const req = { fromPostman: false };
    await modifyMembreRoleInStructures(req, res);
    expect(getStructuresFromDB).toHaveBeenCalledWith({}, { membres: 1 }, false);
    expect(updateStructureInDB).toHaveBeenCalledWith("id4", {
      membres: [{ userId: "userID2", roles: ["contributeur"] }],
    });
    expect(updateStructureInDB).toHaveBeenCalledWith("id5", {
      membres: [
        { userId: "userID1", roles: ["contributeur"] },
        { userId: "userID2", roles: ["contributeur"] },
      ],
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      text: "OK",
      nbUpdated: 1,
      errors: [{ structureId: "id4", error: "ERROR" }],
      updatedArray: [{ structureId: "id5" }],
    });
  });
});
