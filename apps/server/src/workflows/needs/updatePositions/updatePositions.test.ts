// @ts-nocheck
import updatePositionsEndpoint from "./updatePositions";
import { updatePositions } from "../../../modules/needs/needs.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";

/* jest.mock("../../../modules/needs/needs.repository", () => ({
  updatePositions: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkRequestIsFromSite: jest.fn().mockReturnValue(true),
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock("../../../schema/schemaNeeds", () => ({
  Need: jest.fn().mockImplementation(w => w)
})); */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("updatePositions", () => {
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
      body: {}
    };
    await updatePositionsEndpoint[1](req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    })
    const req = {
      user: { roles: [] },
      body: {}
    };
    await updatePositionsEndpoint[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it("should return 200", async () => {
    const req = {
      user: { roles: [], userId: "id" },
      body: { orderedNeedIds: ["1", "2", "3"] }
    };
    await updatePositionsEndpoint[1](req, res);
    expect(updatePositions).toHaveBeenCalledWith(["1", "2", "3"]);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
