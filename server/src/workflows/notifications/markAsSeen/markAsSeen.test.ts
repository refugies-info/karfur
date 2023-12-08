// @ts-nocheck
/* import markAsSeen from "./markAsSeen";
import { markNotificationAsSeen } from "../../../modules/notifications/notifications.service"; */

/* jest.mock("../../../modules/notifications/notifications.service", () => ({
  markNotificationAsSeen: jest.fn(),
})); */


type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("markAsSeen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 200", async () => {
    const req = {
      headers: {
        "x-app-uid": "test"
      },
      body: { notificationId: "id" },
    };
    await markAsSeen[1](req, res);
    expect(markNotificationAsSeen).toHaveBeenCalledWith("id", "test");
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
