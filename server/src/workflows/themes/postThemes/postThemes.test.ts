// @ts-nocheck
import postThemes from "./postThemes";
import { createTheme } from "../../../modules/themes/themes.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";

jest.mock("../../../modules/themes/themes.repository", () => ({
  createTheme: jest.fn(),
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

describe("postThemes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    checkRequestIsFromSite.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_SITE");
    });
    const req = { fromSite: false };
    await postThemes[1](req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    })
    const req = {
      user: { roles: [] },
    };
    await postThemes[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 200", async () => {
    const req = {
      fromSite: true,
      body: {
        name: {fr: "Theme"}
      },
      user: { roles: [] },
      userId: "id"
    };
    await postThemes[1](req, res);
    expect(createTheme).toHaveBeenCalledWith({
      name: {fr: "Theme"},
    });
    expect(getActiveLanguagesFromDB).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
  });

});
