// @ts-nocheck
/* import { updateUserFavorites } from "./updateUserFavorites";
import { updateUserInDB } from "../../../modules/users/users.repository"; */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
jest.mock("../../../modules/users/users.repository", () => ({
  updateUserInDB: jest.fn(),
}));

describe.skip("updateUserFavorites", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();
  it("should return 405 if not from site", async () => {
    const req = { fromSite: false };
    await updateUserFavorites(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should return 400 if no type", async () => {
    const req = { fromSite: true, body: { noType: "test" } };
    await updateUserFavorites(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if type remove but no dispositifId", async () => {
    const req = { fromSite: true, body: { type: "remove" } };
    await updateUserFavorites(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 200 with type remove", async () => {
    const req = {
      fromSite: true,
      body: { type: "remove", dispositifId: "id" },
      user: {
        cookies: { dispositifsPinned: [{ _id: "id" }, { _id: "id1" }] },
        _id: "userID",
      },
    };
    await updateUserFavorites(req, res);
    expect(updateUserInDB).toHaveBeenCalledWith("userID", {
      cookies: { dispositifsPinned: [{ _id: "id1" }] },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 200 with type remove-all", async () => {
    const req = {
      fromSite: true,
      body: { type: "remove-all" },
      user: {
        cookies: { dispositifsPinned: [{ _id: "id" }, { _id: "id1" }] },
        _id: "userID",
      },
    };
    await updateUserFavorites(req, res);
    expect(updateUserInDB).toHaveBeenCalledWith("userID", {
      cookies: { dispositifsPinned: [] },
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
