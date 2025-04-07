import { userFixture } from "../../../__fixtures__";
import { isInContact } from "./isInContact";

jest.mock("@getbrevo/brevo", () => ({
  ContactsApi: jest.fn().mockReturnValue({
    setApiKey: jest.fn(),
    getContactInfo: jest.fn().mockResolvedValue({ body: { listIds: [57] } }),
  }),
  ContactsApiApiKeys: {
    apiKey: "",
  },
  TransactionalSMSApi: jest.fn().mockReturnValue({
    setApiKey: jest.fn(),
  }),
  TransactionalSMSApiApiKeys: {
    apiKey: "",
  },
  SendTransacSms: jest.fn(),
}));

describe("isInNewsletterList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true", async () => {
    const res = await isInContact(userFixture);
    expect(res).toBe(true);
  });
});
