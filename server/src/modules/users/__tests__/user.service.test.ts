// @ts-nocheck
import { addStructureForUsers, proceedWithLogin, getUsersFromStructureMembres } from "../users.service";
import { updateUserInDB, getUserById, addStructureForUsersInDB } from "../users.repository";

jest.mock("../users.repository", () => ({
  getUserById: jest.fn(),
  updateUserInDB: jest.fn(),
  addStructureForUsersInDB: jest.fn().mockResolvedValueOnce()
}));
jest.mock("../../../logger");

describe("addStructureForUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should add the structure to the user", async () => {
    await addStructureForUsers(["userId"], "structId");
    expect(addStructureForUsersInDB).toHaveBeenCalledWith(["userId"], "structId");
  });

  it("should throw when addStructureForUsersInDB throws", async () => {
    addStructureForUsersInDB.mockRejectedValueOnce(new Error("error"));
    try {
      await addStructureForUsers(["userId"], "structId");
    } catch (error) {
      expect(error).toEqual(Error("error"));
    }
    expect.assertions(1);
  });
});

describe("proceedWithLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockDate = new Date(1466424490000);
  jest.spyOn(global, "Date").mockImplementation(() => mockDate);

  it("should call updateUserInDB", async () => {
    await proceedWithLogin({ _id: "id", username: "test" });
    expect(updateUserInDB).toHaveBeenCalledWith("id", {
      last_connected: mockDate
    });
  });
});

describe("getUsersFromStructureMembres", () => {
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
});
