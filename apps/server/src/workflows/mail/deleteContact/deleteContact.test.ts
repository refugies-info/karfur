import { fixtures } from "../../../__fixtures__";
import { deleteContact } from "./deleteContact";

jest.mock("@getbrevo/brevo", () => ({
  BrevoClient: jest.fn().mockReturnValue({
    contacts: {
      deleteContact: jest.fn().mockResolvedValue(undefined),
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
    const res = await deleteContact(fixtures.user);
    expect(res).toEqual(undefined);
  });
});
