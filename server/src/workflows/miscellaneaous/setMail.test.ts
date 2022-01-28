// @ts-nocheck
import { setMail } from "./setMail";

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("node-mailjet", () => ({
  connect: jest.fn().mockReturnValue({
    post: jest.fn().mockReturnValue({
      request: jest.fn().mockResolvedValue({
        body: {
          "Data": [
            { "ID": "id_user" }
          ]
        }
      }),
      id: jest.fn().mockReturnValue({
        action: jest.fn().mockReturnValue({
          request: jest.fn().mockResolvedValue({body: []})
        })
      })
    })
   }),
}));

describe("setMail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const res = mockResponse();
  it("should return 405 if not from site", async () => {
    const req = { fromSite: false };
    await setMail(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête bloquée par API" });
  });
  it("should return 400 if no body", async () => {
    const req = { fromSite: true };
    await setMail(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 400 if no body query", async () => {
    const req = { fromSite: true, body: { test: "s" } };
    await setMail(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ text: "Requête invalide" });
  });

  it("should return 200", async () => {
    const req = { fromSite: true, body: { mail: "test@test.com" } };
    await setMail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
