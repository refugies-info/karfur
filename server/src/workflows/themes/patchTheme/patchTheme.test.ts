// @ts-nocheck
import patchTheme from "./patchTheme";
import { updateTheme } from "../../../modules/themes/themes.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";

jest.mock("../../../modules/themes/themes.repository", () => ({
  updateTheme: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../schema/schemaTheme", () => ({
  Theme: jest.fn().mockImplementation(w => w)
}));
jest.mock("../../../modules/langues/langues.repository", () => ({
  getActiveLanguagesFromDB: jest.fn(),
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("patchTheme", () => {
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
    await patchTheme[1](req, res);
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
    await patchTheme[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 200", async () => {
    const req = {
      fromSite: true,
      user: { roles: [] },
      params: { id: "themeId" },
      userId: "userId",
      body: {
        name: {fr: "test"}
      }
    };
    await patchTheme[1](req, res);
    expect(updateTheme).toHaveBeenCalledWith("themeId", {
      name: {fr: "test"}
    });
    expect(getActiveLanguagesFromDB).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });

});
