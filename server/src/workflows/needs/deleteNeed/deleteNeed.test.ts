// @ts-nocheck
import deleteNeed from "./deleteNeed";
import { deleteNeedById } from "../../../modules/needs/needs.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { getActiveContents } from "../../../modules/dispositif/dispositif.repository";

jest.mock("../../../modules/needs/needs.repository", () => ({
  deleteNeedById: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../schema/schemaNeeds", () => ({
  Need: jest.fn().mockImplementation(w => w)
}));
jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  getActiveContents: jest.fn(),
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
  it("should return 400 if dispositifs associated", async () => {
    const req = {
      user: { roles: [], userId: "id" },
      params: {id: "needId2"}
    };
    getActiveContents.mockImplementationOnce(() => {
      return [
        {_id: "1", needs: ["needId1"]},
        {_id: "2", needs: ["needId1", "needId2"]}
      ]
    });
    await deleteNeed[1](req, res);
    expect(getActiveContents).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("should return 200", async () => {
    const req = {
      user: { roles: [], userId: "id" },
      params: {id: "needId"}
    };
    getActiveContents.mockImplementationOnce(() => {
      return [
        { _id: "1", needs: ["needId1", "needId2"] },
        {_id: "2", needs: ["needId1"]}
      ]
    });
    await deleteNeed[1](req, res);
    expect(getActiveContents).toHaveBeenCalled();
    expect(deleteNeedById).toHaveBeenCalledWith("needId");
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
