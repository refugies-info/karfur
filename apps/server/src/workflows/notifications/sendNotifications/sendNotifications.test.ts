// @ts-nocheck
// import sendNotifications from "./sendNotifications";
import {
  checkIfUserIsAdmin,
} from "../../../libs/checkAuthorizations";
import { sendNotificationsForDemarche } from "../../../modules/notifications/notifications.service";
import { log } from "./log";

/* jest.mock("../../../modules/notifications/notifications.service", () => ({
  sendNotificationsForDemarche: jest.fn(),
}));
jest.mock("../../../libs/checkAuthorizations", () => ({
  checkIfUserIsAdmin: jest.fn().mockReturnValue(true),
}));
jest.mock("./log", () => ({
  log: jest.fn().mockResolvedValue(undefined)
})); */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("sendNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 403 if not admin", async () => {
    checkIfUserIsAdmin.mockImplementationOnce(() => {
      throw new Error("NOT_AUTHORIZED");
    })
    const req = {
      user: { roles: [] },
    };
    await sendNotifications[1](req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 200", async () => {
    const req = {
      fromSite: true,
      body: { demarcheId: "id" },
      user: { roles: [] },
      userId: "user"
    };
    await sendNotifications[1](req, res);
    expect(sendNotificationsForDemarche).toHaveBeenCalledWith("id");
    expect(log).toHaveBeenCalledWith("id", "user");
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
