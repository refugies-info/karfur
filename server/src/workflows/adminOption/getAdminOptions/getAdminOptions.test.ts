// @ts-nocheck
import getAdminOptions from "./getAdminOptions";
import { getAdminOption } from "../../../modules/adminOptions/adminOptions.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";

/* jest.mock("../../../modules/adminOptions/adminOptions.repository", () => ({
  getAdminOption: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true),
})); */


type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("getAdminOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    checkRequestIsFromSite.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_SITE");
    });
    const req = { fromSite: false };
    await getAdminOptions[1](req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    })
    const req = {
      user: { roles: [] },
    };
    await getAdminOptions[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it("should return 200", async () => {
    const req = {
      fromSite: true,
      user: { roles: [] },
      params: {
        key: "notifs"
      }
    };
    await getAdminOptions[1](req, res);
    expect(getAdminOption).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
