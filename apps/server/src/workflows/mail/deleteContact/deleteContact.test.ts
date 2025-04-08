import { fixtures } from "../../../__fixtures__";
import { deleteContact } from "./deleteContact";

jest.mock("@getbrevo/brevo", () => ({
  ContactsApi: jest.fn().mockReturnValue({
    setApiKey: jest.fn(),
    deleteContact: jest.fn().mockResolvedValue(undefined),
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
    const res = await deleteContact(fixtures.user);
    expect(res).toEqual(undefined);
  });
});
