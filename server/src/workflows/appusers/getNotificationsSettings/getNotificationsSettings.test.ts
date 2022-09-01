// @ts-nocheck
import getNotificationsSettingsHandler from "./getNotificationsSettings";
import { getNotificationsSettings } from "../../../modules/appusers/appusers.repository";

jest.mock("../../../modules/appusers/appusers.repository", () => ({
  getNotificationsSettings: jest.fn().mockReturnValue(),
}));


type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getNotificationsSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 404 if no settings", async () => {
    const req = {
      headers: {
        "x-app-uid": "test"
      },
    };
    getNotificationsSettings.mockReturnValueOnce(null);
    await getNotificationsSettingsHandler[1](req, res);
    expect(getNotificationsSettings).toHaveBeenCalledWith("test");
    expect(res.status).toHaveBeenCalledWith(404);
  });
  it("should return 200", async () => {
    const req = {
      headers: {
        "x-app-uid": "test"
      },
    };
    getNotificationsSettings.mockReturnValueOnce({uid: "test"});
    await getNotificationsSettingsHandler[1](req, res);
    expect(getNotificationsSettings).toHaveBeenCalledWith("test");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({uid: "test"});
  });

});
