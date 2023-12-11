// @ts-nocheck
/*import downloadApp from "./downloadApp";
import { sendSMS } from "../../../connectors/twilio/sendSMS"; */

/* jest.mock("../../../connectors/twilio/sendSMS", () => ({
  sendSMS: jest.fn()
})); */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe.skip("downloadApp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 200", async () => {
    sendSMS.mockResolvedValue(true);
    const req = {
      body: {
        phone: "0606060606",
        locale: "fr"
      },
    };
    await downloadApp[1](req, res);
    expect(sendSMS).toHaveBeenCalledWith(
      "Voici le lien pour télécharger l'application Réfugiés.info : https://refugies.info/fr/download-app",
      "0606060606"
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return 500", async () => {
    sendSMS.mockResolvedValue(false);
    const req = {
      body: {
        phone: "0606060606",
        locale: "fr"
      },
    };
    await downloadApp[1](req, res);
    expect(sendSMS).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
