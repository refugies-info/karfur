// @ts-nocheck
import updateDispositif from "./updateDispositif";
import { updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import {
  checkIfUserIsAdmin,
} from "../../../libs/checkAuthorizations";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("airtable");
jest.mock("@sendgrid/mail");

/* jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  updateDispositifInDB: jest.fn(),
})); */

describe.skip("updateDispositif", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 if not fromSite", async () => {
    const req = { body: {}, params: { id: "id" } };
    const res = mockResponse();
    await updateDispositif[1](req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });

  it("should call updateDispositifInDB", async () => {
    const req = {
      fromSite: true,
      body: {
        webOnly: true,
      },
      params: { id: "id" },
      user: { _id: "userId", roles: [{ nom: "Admin" }] }
    };

    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const res = mockResponse();
    await updateDispositif[1](req, res);
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      webOnly: true,
      lastAdminUpdate: date,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });
});
