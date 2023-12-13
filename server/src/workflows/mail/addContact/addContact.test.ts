// @ts-nocheck
/* import { setMail } from "./setMail"; */

type MockResponse = { json: any; status: any };
const mockResponse = (): MockResponse => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("@sendinblue/client", () => ({
  ContactsApi: jest.fn().mockReturnValue({
    setApiKey: jest.fn(),
    createContact: jest.fn().mockResolvedValue({})
  }),
  ContactsApiApiKeys: {
    apiKey: ""
  },
  CreateContact: jest.fn().mockImplementation(() => {
    return {}
  })
}));

describe.skip("setMail", () => {
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
  it("should return 200", async () => {
    const req = { fromSite: true, body: { mail: "test@test.com" } };
    await setMail(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
