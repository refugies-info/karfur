import { fixtures } from "../../../__fixtures__";
import { isInContact } from "./isInContact";

jest.mock("@getbrevo/brevo", () => ({
  BrevoClient: jest.fn().mockReturnValue({
    contacts: {
      getContactInfo: jest.fn().mockResolvedValue({ listIds: [57] }),
    },
    transactionalSms: {},
  }),
  BrevoError: class BrevoError extends Error {},
}));

describe("isInNewsletterList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true", async () => {
    const res = await isInContact(fixtures.user);
    expect(res).toBe(true);
  });
});
