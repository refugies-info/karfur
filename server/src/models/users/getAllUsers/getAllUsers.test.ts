// @ts-nocheck
import { getAllUsers } from "./getAllUsers";
import { getAllUsersFromDB } from "../users.repository";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../users.repository", () => ({
  getAllUsersFromDB: jest
    .fn()
    .mockResolvedValue([{ username: "user1" }, { username: "user2" }]),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
}));

describe("getAllUsers", () => {
  it("should call getAllUsersFromDB and return 200", async () => {
    const res = mockResponse();
    await getAllUsers({}, res);
    expect(getAllUsersFromDB).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ username: "user1" }, { username: "user2" }],
    });
  });

  it("should call getAllUsersFromDB and return 500 if it throws", async () => {
    getAllUsersFromDB.mockRejectedValueOnce(new Error("erreur"));
    const res = mockResponse();
    await getAllUsers({}, res);
    expect(getAllUsersFromDB).toHaveBeenCalledWith();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      text: "Erreur interne",
    });
  });
});
