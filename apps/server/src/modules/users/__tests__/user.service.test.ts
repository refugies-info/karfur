import type { RoleName } from "@refugies-info/api-types";
import type { DocumentType } from "@refugies-info/mongo";
import { ObjectId, Role, RoleModel, UserModel } from "@refugies-info/mongo";
import { fixtures } from "../../../__fixtures__";
import { addLog } from "../../logs/logs.service";
import { sendWelcomeMail } from "../../mail/mail.service";
import * as roleRep from "../../role/role.repository";
import * as usersRep from "../users.repository";
import { addStructureForUsers, registerUser, updateLastConnected } from "../users.service";

jest.mock("../../role/role.repository", () => ({
  getRoleByName: jest.fn(),
}));
jest.mock("../../mail/mail.service", () => ({
  sendWelcomeMail: jest.fn(),
}));
jest.mock("../../logs/logs.service", () => ({
  addLog: jest.fn(),
}));
jest.mock("../../../logger");

const userId = new ObjectId("6569af9815c38bd134125ff3"); // see fixture

describe("addStructureForUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should add the structure to the user", async () => {
    //@ts-expect-error typing issue with jest.spyOn
    jest.spyOn(usersRep, "addStructureForUsersInDB").mockResolvedValue(() => {});
    await addStructureForUsers(["userId"], "structId");
    expect(usersRep.addStructureForUsersInDB).toHaveBeenCalledWith(["userId"], "structId");
  });

  it("should throw when addStructureForUsersInDB throws", async () => {
    jest.spyOn(usersRep, "addStructureForUsersInDB").mockRejectedValueOnce(new Error("error"));
    try {
      await addStructureForUsers(["userId"], "structId");
    } catch (error) {
      expect(error).toEqual(Error("error"));
    }
    expect.assertions(1);
  });
});

describe("updateLastConnected", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockDate = new Date(1466424490000);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  it("should call updateUserInDB", async () => {
    //@ts-expect-error typing issue with jest.spyOn
    jest.spyOn(usersRep, "updateUserInDB").mockResolvedValue(() => {});
    await updateLastConnected(fixtures.user);
    expect(usersRep.updateUserInDB).toHaveBeenCalledWith(userId, {
      last_connected: new Date(1466424490000),
      mfaCode: null,
    });
  });
});

const roleId = new ObjectId("6569af9815c38bd134125ff3");
describe("registerUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockDate = new Date(1466424490000);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    jest.spyOn(roleRep, "getRoleByName").mockImplementation(async (roleName: RoleName) => {
      const role = new RoleModel();
      role._id = roleId;
      role.nom = roleName;
      role.nomPublique = "";
      return role;
    });

    jest
      .spyOn(usersRep, "createUser")
      .mockImplementation(
        async (userData) => new UserModel({ ...fixtures.user.toObject(), ...userData }),
      );
  });

  it("should create user", async () => {
    const data = { email: "test@example.com" };
    await registerUser(data);
    expect(usersRep.createUser).toHaveBeenCalledWith({
      email: "test@example.com",
      firstName: null,
      password: null,
      roles: [roleId],
      status: "Actif",
      last_connected: new Date(1466424490000),
    });
    expect(sendWelcomeMail).toHaveBeenCalledWith("test@example.com", "", userId);
    expect(addLog).toHaveBeenCalledWith(userId, "User", "Utilisateur créé : première connexion");
  });

  it("allows SSO users without a password", async () => {
    const user = new UserModel({
      email: "sso@example.com",
      firstName: "Ada",
      password: null,
      roles: [roleId],
      status: "Actif",
      last_connected: new Date(1466424490000),
    });

    await expect(user.validate()).resolves.toBeUndefined();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
