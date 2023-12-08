// @ts-nocheck
import deleteUser from "./deleteUser";
import { getUserById, updateUserInDB } from "../../../modules/users/users.repository";
import { removeMemberFromStructure } from "../../../modules/structure/structure.repository";
import { sendAccountDeletedMailService } from "../../../modules/mail/mail.service";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";

jest.mock("../../../modules/users/users.repository", () => ({
  updateUserInDB: jest.fn(),
  getUserById: jest.fn()
}));
jest.mock("../../../modules/structure/structure.repository", () => ({
  removeMemberFromStructure: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true),
}));
jest.mock("../../../libs/generateRandomId", () => ({
  generateRandomId: jest.fn().mockReturnValue(1),
}));
jest.mock("../../../modules/mail/mail.service", () => ({
  sendAccountDeletedMailService: jest.fn().mockReturnValue(1),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    checkRequestIsFromSite.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_SITE");
    });
    const req = {
      fromSite: false,
      params: {}
    };
    await deleteUser[1](req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    })
    const req = {
      user: { roles: [] },
      params: {}
    };
    await deleteUser[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 400 if user does not exist", async () => {
    getUserById.mockImplementationOnce(() => {
      return null
    })
    const req = {
      user: { roles: [], userId: "id" },
      params: { id: "userId" }
    };
    await deleteUser[1](req, res);
    expect(getUserById).toHaveBeenCalledWith("userId", { structures: 1, email: 1 });
    expect(updateUserInDB).not.toHaveBeenCalled();
    expect(removeMemberFromStructure).not.toHaveBeenCalled();
    expect(sendAccountDeletedMailService).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 200", async () => {
    getUserById.mockImplementationOnce(() => {
      return {
        structures: ["structure1", "structure2"],
        email: "test@test.com"
      }
    })
    const req = {
      user: { roles: [], userId: "id" },
      params: { id: "userId" }
    };
    await deleteUser[1](req, res);
    expect(getUserById).toHaveBeenCalledWith("userId", { structures: 1, email: 1 });
    expect(removeMemberFromStructure).toHaveBeenCalledWith("structure1", "userId");
    expect(removeMemberFromStructure).toHaveBeenCalledWith("structure2", "userId");
    expect(updateUserInDB).toHaveBeenCalledWith("userId", {
      username: "utilisateur_1",
      password: "",
      phone: "",
      email: "",
      picture: null,
      authy_id: "",
      cookies: null,
      reset_password_token: "",
      structures: [],
      roles: [],
      status: "Exclu"
    });
    expect(sendAccountDeletedMailService).toHaveBeenCalledWith("test@test.com");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
