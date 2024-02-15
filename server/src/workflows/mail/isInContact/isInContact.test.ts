import { user } from "../../../__fixtures__";
import { isInContact } from "./isInContact";

jest.mock("@sendinblue/client", () => ({
  ContactsApi: jest.fn().mockReturnValue({
    setApiKey: jest.fn(),
    getContactInfo: jest.fn().mockResolvedValue({ body: { listIds: [57] } })
  }),
  ContactsApiApiKeys: {
    apiKey: ""
  }
}));

describe("isInNewsletterList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true", async () => {
    const res = await isInContact(user);
    expect(res).toBe(true);
  });
});
