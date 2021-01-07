// @ts-nocheck
import {
  getFiguresOnUsers,
  getAllUsers,
  updateRoleOfResponsable,
} from "../users.service";
import { User } from "../../../schema/schemaUser";
import logger from "../../../logger";
import {
  getAllUsersFromDB,
  getUserById,
  updateUser,
} from "../users.repository";
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
  getUserById: jest
    .fn()
    .mockResolvedValue({ _id: "userId", roles: ["hasStructureId"] }),
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

describe("getFiguresOnUsers", () => {
  it("should return correct figures", async () => {
    User.find = jest
      .fn()
      .mockReturnValue({ populate: jest.fn().mockResolvedValue(users) });
    const res = mockResponse();
    await getFiguresOnUsers({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        nbContributors: 1,
        nbTraductors: 2,
        nbExperts: 1,
      },
    });
  });

  it("should return correct figures", async () => {
    User.find = jest
      .fn()
      .mockReturnValue({ populate: jest.fn().mockResolvedValue(users2) });
    const res = mockResponse();
    await getFiguresOnUsers({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        nbContributors: 0,
        nbTraductors: 2,
        nbExperts: 1,
      },
    });
  });

  it("should return zero values if user.find throws", async () => {
    User.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("error")),
    });
    const res = mockResponse();
    await getFiguresOnUsers({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        nbContributors: 0,
        nbTraductors: 0,
        nbExperts: 0,
      },
    });
    expect(logger.error).toHaveBeenCalledWith(
      "[getFiguresOnUsers] error while getting users",
      {
        error: new Error("error"),
      }
    );
  });
});

describe("getAllUsers", () => {
  it("should call getAllUsersFromDB", async () => {
    const res = mockResponse();
    await getAllUsers({}, res);
    expect(getAllUsersFromDB).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ username: "user1" }, { username: "user2" }],
    });
  });
});

describe("updateRoleOfResponsable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should call getUserById getRoleByName and not updateUser when user has role already", async () => {
    await updateRoleOfResponsable("userId");
    expect(getUserById).toHaveBeenCalledWith("userId", { roles: 1 });
    expect(getRoleByName).toHaveBeenCalledWith("hasStructure");
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("should call getUserById getRoleByName and updateUser when user has not role already", async () => {
    getUserById.mockResolvedValueOnce({ _id: "userId", roles: ["role1"] });
    await updateRoleOfResponsable("userId");
    expect(getUserById).toHaveBeenCalledWith("userId", { roles: 1 });
    expect(getRoleByName).toHaveBeenCalledWith("hasStructure");
    expect(updateUser).toHaveBeenCalledWith("userId", {
      roles: ["role1", "hasStructureId"],
    });
  });

  it("should throw when getUserById throws", async () => {
    getUserById.mockRejectedValueOnce(new Error("error"));
    try {
      await updateRoleOfResponsable("userId");
    } catch (error) {
      expect(getUserById).toHaveBeenCalledWith("userId", { roles: 1 });
      expect(error).toEqual(Error("error"));
    }
    expect.assertions(2);
  });

  it("should throw when getRoleByName throws", async () => {
    getRoleByName.mockRejectedValueOnce(new Error("error"));
    try {
      await updateRoleOfResponsable("userId");
    } catch (error) {
      expect(getUserById).toHaveBeenCalledWith("userId", { roles: 1 });
      expect(getRoleByName).toHaveBeenCalledWith("hasStructure");

      expect(error).toEqual(Error("error"));
    }
    expect.assertions(3);
  });

  it("should throw when updateUser throws", async () => {
    updateUser.mockRejectedValueOnce(new Error("error"));
    getUserById.mockResolvedValueOnce({ _id: "userId", roles: ["role1"] });

    try {
      await updateRoleOfResponsable("userId");
    } catch (error) {
      expect(getUserById).toHaveBeenCalledWith("userId", { roles: 1 });
      expect(getRoleByName).toHaveBeenCalledWith("hasStructure");
      expect(updateUser).toHaveBeenCalledWith("userId", {
        roles: ["role1", "hasStructureId"],
      });
      expect(error).toEqual(Error("error"));
    }
    expect.assertions(4);
  });
});
