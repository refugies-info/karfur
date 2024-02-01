import { DocumentType } from "@typegoose/typegoose";
import { ObjectId, Role, RoleModel, UserModel } from "../../../typegoose";
import { addStructureForUsers, registerUser, getUsersFromStructureMembres, updateLastConnected } from "../users.service";
import { sendWelcomeMail } from "../../mail/mail.service";
import { addLog } from "../../logs/logs.service";
import * as usersRep from "../users.repository";
import { RoleName } from "@refugies-info/api-types";
import * as roleRep from "../../role/role.repository";
import { user } from "../../../__fixtures__";

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
    //@ts-expect-error
    jest.spyOn(usersRep, "addStructureForUsersInDB").mockResolvedValue(() => { });
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
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);
  });

  it("should call updateUserInDB", async () => {
    //@ts-expect-error
    jest.spyOn(usersRep, "updateUserInDB").mockResolvedValue(() => { });
    await updateLastConnected(user);
    expect(usersRep.updateUserInDB).toHaveBeenCalledWith(userId, {
      last_connected: new Date(1466424490000)
    });
  });
});
/*
describe.skip("getUsersFromStructureMembres", () => {
  const membres = [
    { role: [] },
    { userId: "userId1" },
    { userId: "userId2" },
    { userId: "userId3" },
    { userId: "userId4" }
  ];
  const userNeededFields = {
    username: 1,
    email: 1,
    status: 1
  };
  it("should call getUserById", async () => {
    getUserById.mockResolvedValueOnce({ _id: "userId1", status: "Exclu" });
    getUserById.mockResolvedValueOnce({ _id: "userId2", status: "Actif" });
    getUserById.mockResolvedValueOnce({
      _id: "userId3",
      status: "Actif",
      email: "email3",
      username: "pseudo3"
    });
    getUserById.mockResolvedValueOnce({
      _id: "userId4",
      status: "Actif",
      email: "email4",
      username: "pseudo4"
    });

    const res = await getUsersFromStructureMembres(membres);
    expect(getUserById).toHaveBeenCalledWith("userId1", userNeededFields);
    expect(getUserById).toHaveBeenCalledWith("userId2", userNeededFields);
    expect(getUserById).toHaveBeenCalledWith("userId3", userNeededFields);
    expect(getUserById).toHaveBeenCalledWith("userId4", userNeededFields);
    expect(res).toEqual([
      { username: "pseudo3", _id: "userId3", email: "email3" },
      { username: "pseudo4", _id: "userId4", email: "email4" }
    ]);
  });
});*/

const roleId = new ObjectId("6569af9815c38bd134125ff3");
describe("registerUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockDate = new Date(1466424490000);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    jest.spyOn(roleRep, "getRoleByName").mockImplementation(async (roleName: RoleName): Promise<DocumentType<Role>> => {
      const role = new Role()
      role._id = roleId;
      role.nom = roleName;
      role.nomPublic = ""
      return new RoleModel(role);
    })

    jest.spyOn(usersRep, "createUser").mockImplementation(async userData => new UserModel({ ...user, ...userData }));
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
    expect(sendWelcomeMail).toHaveBeenCalledWith("test@example.com", null, userId)
    expect(addLog).toHaveBeenCalledWith(userId, "User", "Utilisateur créé : première connexion")
  });


  afterEach(() => {
    jest.useRealTimers();
  });
});
