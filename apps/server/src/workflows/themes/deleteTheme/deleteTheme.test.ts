// @ts-nocheck
import deleteTheme from "./deleteTheme";
import { deleteThemeById } from "../../../modules/themes/themes.repository";
import { checkIfUserIsAdmin, checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { AppUserModel } from "../../../typegoose/AppUser";

/* jest.mock("../../../modules/themes/themes.repository", () => ({
  deleteThemeById: jest.fn()
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true)
}));

jest.mock("../../../schema/schemaTheme", () => ({
  Theme: jest.fn().mockImplementation((w) => w)
}));

jest.mock("../../../typegoose/AppUser", () => ({
  AppUserModel: { updateMany: jest.fn() }
})); */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("deleteTheme", () => {
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
    await deleteTheme[1](req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    });
    const req = {
      user: { roles: [] },
      params: {}
    };
    await deleteTheme[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it("should return 200", async () => {
    const req = {
      user: { roles: [], userId: "id" },
      params: { id: "themeId" }
    };
    await deleteTheme[1](req, res);
    expect(deleteThemeById).toHaveBeenCalledWith("themeId");
    expect(AppUserModel.updateMany).toHaveBeenCalledWith({}, { $unset: { "notificationsSettings.themes.themeId": 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
