import { deleteUser } from "./deleteUser";
import * as usersRep from "../../../modules/users/users.repository";
import * as usersServ from "../../../modules/users/users.service";
import * as mailServ from "../../../modules/mail/mail.service";
import { UserModel } from "../../../typegoose";

jest.mock("../../../modules/users/users.repository", () => ({
  getUserById: jest.fn()
}));
jest.mock("../../../modules/users/users.service", () => ({
  deleteUser: jest.fn()
}));
jest.mock("../../../modules/mail/mail.service", () => ({
  sendAccountDeletedMailService: jest.fn().mockReturnValue(1),
}));


describe("deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get user and return error if no user", async () => {
    const getUserByIdMock = jest.spyOn(usersRep, 'getUserById');
    getUserByIdMock.mockResolvedValue(null);

    try {
      await deleteUser("id");
    } catch (error) {
      expect(getUserByIdMock).toHaveBeenCalledWith("id", { email: 1, structures: 1 });
      expect(error.message).toBe("INVALID_REQUEST");
    }
    expect.assertions(2);
  });
  it("should get user and delete it. No email if not available", async () => {
    const user = new UserModel({ email: null });
    const getUserByIdMock = jest.spyOn(usersRep, 'getUserById');
    getUserByIdMock.mockResolvedValue(user);

    const deleteUserMock = jest.spyOn(usersServ, 'deleteUser');
    const sendMailMock = jest.spyOn(mailServ, 'sendAccountDeletedMailService');

    await deleteUser("id");
    expect(getUserByIdMock).toHaveBeenCalledWith("id", { email: 1, structures: 1 });
    expect(deleteUserMock).toHaveBeenCalledWith(user);
    expect(sendMailMock).not.toHaveBeenCalled();
  });
  it("should get user and delete it. Email if available", async () => {
    const user = new UserModel({ email: "test@example.com" });
    const getUserByIdMock = jest.spyOn(usersRep, 'getUserById');
    getUserByIdMock.mockResolvedValue(user);

    const deleteUserMock = jest.spyOn(usersServ, 'deleteUser');
    const sendMailMock = jest.spyOn(mailServ, 'sendAccountDeletedMailService');

    await deleteUser("id");
    expect(getUserByIdMock).toHaveBeenCalledWith("id", { email: 1, structures: 1 });
    expect(deleteUserMock).toHaveBeenCalledWith(user);
    expect(sendMailMock).toHaveBeenCalledWith("test@example.com");
  });
});
