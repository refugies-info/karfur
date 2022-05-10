// @ts-nocheck
import { getLogs } from "./getLogs";
import { findLogs } from "../../../modules/logs/logs.repository";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";

jest.mock("../../../modules/logs/logs.repository", () => ({
  findLogs: jest.fn(),
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

describe("getLogs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 405 if not from site", async () => {
    checkRequestIsFromSite.mockImplementationOnce(() => {
      throw new Error("NOT_FROM_SITE");
    });
    const req = { fromSite: false };
    await getLogs(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    })
    const req = {
      user: { roles: [] },
    };
    await getLogs(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
  it("should return 400 if invalid request", async () => {
    const req = {
      body: {  },
      user: { roles: [] },
    };
    await getLogs(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("should return 200", async () => {
    const req = {
      fromSite: true,
      body: { id: "id" },
      user: { roles: [] },
    };
    await getLogs(req, res);
    expect(findLogs).toHaveBeenCalledWith("id");
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
