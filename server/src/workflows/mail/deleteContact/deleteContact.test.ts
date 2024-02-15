import { user } from "../../../__fixtures__";
import { deleteContact } from "./deleteContact";

jest.mock("@sendinblue/client", () => ({
  ContactsApi: jest.fn().mockReturnValue({
    setApiKey: jest.fn(),
    deleteContact: jest.fn().mockResolvedValue(undefined)
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
    const res = await deleteContact(user);
    expect(res).toEqual(undefined);
  });
});
