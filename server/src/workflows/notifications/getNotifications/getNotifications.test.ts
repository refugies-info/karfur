// @ts-nocheck
import getNotifications from "./getNotifications";
import { getNotificationsForUser } from "../../../modules/notifications/notifications.service";

jest.mock("../../../modules/notifications/notifications.service", () => ({
  getNotificationsForUser: jest.fn().mockReturnValue([
    {
      uid: "test",
      seen: false,
      title: "notif 1",
      data: {}
    },
    {
      uid: "test",
      seen: false,
      title: "notif 2",
      data: {}
    },
    {
      uid: "test",
      seen: true,
      title: "notif 3",
      data: {}
    },
    {
      uid: "test",
      seen: false,
      title: "notif 4",
      data: {}
    },
  ]),
}));


type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 200", async () => {
    const req = {
      headers: {
        "x-app-uid": "test"
      },
    };
    await getNotifications[1](req, res);
    expect(getNotificationsForUser).toHaveBeenCalledWith("test");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      unseenCount: 3,
      notifications: [
        {
          uid: "test",
          seen: false,
          title: "notif 1",
          data: {}
        },
        {
          uid: "test",
          seen: false,
          title: "notif 2",
          data: {}
        },
        {
          uid: "test",
          seen: true,
          title: "notif 3",
          data: {}
        },
        {
          uid: "test",
          seen: false,
          title: "notif 4",
          data: {}
        },
      ]
    });
  });

});
