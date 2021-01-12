// @ts-nocheck
import { updateRoleAndStructureOfResponsable } from "../users.service";
import { User } from "../../../schema/schemaUser";
import logger from "../../../logger";
import { getUserById, updateUser } from "../users.repository";
import { getRoleByName } from "../../role/role.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../../role/role.repository", () => ({
  getRoleByName: jest.fn().mockResolvedValue({ _id: "hasStructureId" }),
}));

jest.mock("../users.repository", () => ({
  getAllUsersFromDB: jest
    .fn()
    .mockResolvedValue([{ username: "user1" }, { username: "user2" }]),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
}));
jest.mock("../../../logger");

const tradRole = {
  _id: "5ce57c969aadae8734c7aeec",
  nom: "Trad",
};
const expertTradRole = {
  _id: "5ce57c969aadae8734c7aeec",
  nom: "ExpertTrad",
};
const contribRole = {
  _id: "5ce57c969aadae8734c7aeec",
  nom: "Contrib",
};
const userRole = {
  _id: "5ce57c969aadae8734c7aeec",
  nom: "User",
};

const users = [
  {
    _id: "5dbff32e367a343830cd2f49",
    roles: [],
  },
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [userRole],
  },
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [tradRole],
  },
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [expertTradRole],
  },
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [contribRole],
  },
];
const users2 = [
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [tradRole],
  },
  {
    _id: "5dbff89209dee20b18091ec3",
    roles: [expertTradRole, tradRole],
  },
];

describe("updateRoleAndStructureOfResponsable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call getUserById getRoleByName and updateUser when user has role already and user has no structures", async () => {
    getUserById.mockResolvedValue({
      _id: "userId",
      roles: ["hasStructureId", "otherRole"],
      structures: [],
    });
    await updateRoleAndStructureOfResponsable("userId", "structId");
    expect(getUserById).toHaveBeenCalledWith("userId", {
      roles: 1,
      structures: 1,
    });
    expect(getRoleByName).toHaveBeenCalledWith("hasStructure");
    expect(updateUser).toHaveBeenCalledWith("userId", {
      roles: ["otherRole", "hasStructureId"],
      structures: ["structId"],
    });
  });

  it("should call getUserById getRoleByName and updateUser when user has not role already", async () => {
    getUserById.mockResolvedValueOnce({
      _id: "userId",
      roles: ["role1"],
      structures: ["struct1"],
    });
    await updateRoleAndStructureOfResponsable("userId", "structId");
    expect(getUserById).toHaveBeenCalledWith("userId", {
      roles: 1,
      structures: 1,
    });
    expect(getRoleByName).toHaveBeenCalledWith("hasStructure");
    expect(updateUser).toHaveBeenCalledWith("userId", {
      roles: ["role1", "hasStructureId"],
      structures: ["struct1", "structId"],
    });
  });

  it("should throw when getUserById throws", async () => {
    getUserById.mockRejectedValueOnce(new Error("error"));
    try {
      await updateRoleAndStructureOfResponsable("userId", "structId");
    } catch (error) {
      expect(getUserById).toHaveBeenCalledWith("userId", {
        roles: 1,
        structures: 1,
      });
      expect(error).toEqual(Error("error"));
    }
    expect.assertions(2);
  });

  it("should throw when getRoleByName throws", async () => {
    getRoleByName.mockRejectedValueOnce(new Error("error"));
    try {
      await updateRoleAndStructureOfResponsable("userId", "structId");
    } catch (error) {
      expect(getUserById).toHaveBeenCalledWith("userId", {
        roles: 1,
        structures: 1,
      });
      expect(getRoleByName).toHaveBeenCalledWith("hasStructure");

      expect(error).toEqual(Error("error"));
    }
    expect.assertions(3);
  });

  it("should throw when updateUser throws", async () => {
    updateUser.mockRejectedValueOnce(new Error("error"));
    getUserById.mockResolvedValueOnce({
      _id: "userId",
      roles: ["role1"],
      structures: [],
    });

    try {
      await updateRoleAndStructureOfResponsable("userId", "structId");
    } catch (error) {
      expect(getUserById).toHaveBeenCalledWith("userId", {
        roles: 1,
        structures: 1,
      });
      expect(getRoleByName).toHaveBeenCalledWith("hasStructure");
      expect(updateUser).toHaveBeenCalledWith("userId", {
        roles: ["role1", "hasStructureId"],
        structures: ["structId"],
      });
      expect(error).toEqual(Error("error"));
    }
    expect.assertions(4);
  });

  it("should call getUserById getRoleByName and updateUser when user has no role and no structures", async () => {
    getUserById.mockResolvedValueOnce({
      _id: "userId",
    });
    await updateRoleAndStructureOfResponsable("userId", "structId");
    expect(getUserById).toHaveBeenCalledWith("userId", {
      roles: 1,
      structures: 1,
    });
    expect(getRoleByName).toHaveBeenCalledWith("hasStructure");
    expect(updateUser).toHaveBeenCalledWith("userId", {
      roles: ["hasStructureId"],
      structures: ["structId"],
    });
  });
});
