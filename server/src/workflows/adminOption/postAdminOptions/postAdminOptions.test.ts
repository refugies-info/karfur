// @ts-nocheck
import postAdminOptions from "./postAdminOptions";
import {
  getAdminOption,
  createAdminOption,
  updateAdminOption
} from "../../../modules/adminOptions/adminOptions.repository";
import { checkIfUserIsAdmin, checkRequestIsFromSite } from "../../../libs/checkAuthorizations";

jest.mock("../../../modules/adminOptions/adminOptions.repository", () => ({
  getAdminOption: jest.fn(),
  createAdminOption: jest.fn(),
  updateAdminOption: jest.fn()
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true)
}));

jest.mock("../../../typegoose/AdminOptions", () => ({
  AdminOptionsModel: jest.fn().mockImplementation((w) => w)
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("postAdminOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    checkRequestIsFromSite.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_SITE");
    });
    const req = { fromSite: false };
    await postAdminOptions[1](req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    });
    const req = {
      user: { roles: [] }
    };
    await postAdminOptions[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it("should return 200 and create if option does not exist yet", async () => {
    const req = {
      fromSite: true,
      body: {
        value: true
      },
      params: {
        key: "notifs"
      },
      user: { roles: [] },
      userId: "id"
    };
    getAdminOption.mockReturnValueOnce(null);
    await postAdminOptions[1](req, res);
    expect(createAdminOption).toHaveBeenCalledWith({
      key: "notifs",
      value: true
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return 200 and update if option exist", async () => {
    const req = {
      fromSite: true,
      body: {
        value: true
      },
      params: {
        key: "notifs"
      },
      user: { roles: [] },
      userId: "id"
    };
    getAdminOption.mockReturnValueOnce({ key: "notifs", value: false });
    await postAdminOptions[1](req, res);
    expect(updateAdminOption).toHaveBeenCalledWith("notifs", true);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
