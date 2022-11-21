// @ts-nocheck
import deleteUser from "./deleteUser";
import { updateUserInDB } from "../../../modules/users/users.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";

jest.mock("../../../modules/users/users.repository", () => ({
  updateUserInDB: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("deleteUser", () => {
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

  it("should return 200", async () => {
    const req = {
      user: { roles: [], userId: "id" },
      params: { id: "userId" }
    };
    await deleteUser[1](req, res);
    expect(updateUserInDB).toHaveBeenCalledWith("userId", { status: "Exclu" });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
