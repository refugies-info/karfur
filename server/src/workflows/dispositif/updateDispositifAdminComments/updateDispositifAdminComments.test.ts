// @ts-nocheck
/* import { updateDispositifAdminComments } from "./updateDispositifAdminComments";
import { updateDispositifInDB, getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { log } from "./log"; */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

/* jest.mock("../../../modules/dispositif/dispositif.repository", () => ({
  updateDispositifInDB: jest.fn(),
  getDispositifById: jest.fn().mockResolvedValue({}),
}));
jest.mock("./log", () => ({
  log: jest.fn().mockResolvedValue(undefined)
})); */

describe.skip("updateDispositifAdminComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 if not fromSite", async () => {
    const req = { body: {} };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });

  it("should return 400 if no body", async () => {
    const req = { fromSite: true };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no query", async () => {
    const req = { fromSite: true, body: { test: "test" } };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no dispositifId", async () => {
    const req = { fromSite: true, body: { query: { test: "test" } } };
    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should call updateDispositifInDB", async () => {
    const req = {
      fromSite: true,
      body: {
        query: {
          dispositifId: "id",
          adminComments: "adminComments",
          adminProgressionStatus: "adminProgressionStatus",
          adminPercentageProgressionStatus: "adminPercentageProgressionStatus",
        },
      },
      user: { _id: "userId" }
    };

    const date = 148707670800;
    Date.now = jest.fn(() => date);

    const res = mockResponse();
    await updateDispositifAdminComments(req, res);
    expect(updateDispositifInDB).toHaveBeenCalledWith("id", {
      adminComments: "adminComments",
      adminProgressionStatus: "adminProgressionStatus",
      adminPercentageProgressionStatus: "adminPercentageProgressionStatus",
      lastAdminUpdate: date,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: "OK" });
  });
});
