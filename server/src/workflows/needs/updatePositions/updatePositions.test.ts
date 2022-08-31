// @ts-nocheck
import deleteNeed from "./deleteNeed";
import { deleteNeedById } from "../../../modules/themes/themes.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";

jest.mock("../../../modules/themes/themes.repository", () => ({
  deleteNeedById: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../schema/schemaNeed", () => ({
  Need: jest.fn().mockImplementation(w => w)
}));

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("deleteNeed", () => {
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
    await deleteNeed[1](req, res);
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
    await deleteNeed[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it("should return 200", async () => {
    const req = {
      user: { roles: [], userId: "id" },
      params: {id: "themeId"}
    };
    await deleteNeed[1](req, res);
    expect(deleteNeedById).toHaveBeenCalledWith("themeId");
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
