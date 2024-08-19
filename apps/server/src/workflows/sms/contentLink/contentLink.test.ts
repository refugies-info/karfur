// @ts-nocheck
/* import contentLink from "./contentLink";
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

describe.skip("contentLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const res = mockResponse();

  it("should return 200", async () => {
    sendSMS.mockResolvedValue(true);
    const req = {
      fromSite: true,
      body: {
        phone: "0606060606",
        title: "Nouvelle fiche",
        url: "https://refugies.info/fr/dispositif/nouvelle-fiche"
      },
    };
    await contentLink[1](req, res);
    expect(sendSMS).toHaveBeenCalledWith(
      "Bonjour\nVoici le lien vers la fiche Nouvelle fiche : https://refugies.info/fr/dispositif/nouvelle-fiche",
      "0606060606"
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return 500", async () => {
    sendSMS.mockResolvedValue(false);
    const req = {
      fromSite: true,
      body: {
        phone: "0606060606",
        title: "Nouvelle fiche",
        url: "https://refugies.info/fr/dispositif/nouvelle-fiche"
      },
    };
    await contentLink[1](req, res);
    expect(sendSMS).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
