const mockSendTransacSms = jest.fn();

jest.mock("@getbrevo/brevo", () => ({
  BrevoClient: jest.fn().mockImplementation(() => ({
    transactionalSms: {
      sendTransacSms: mockSendTransacSms,
    },
  })),
  BrevoError: class BrevoError extends Error {
    statusCode?: number;

    constructor(message: string, statusCode?: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

jest.mock("~/logger");

describe("Brevo sendSMS", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.BREVO_API_KEY = "brevo-api-key";
    process.env.SMS_SENDER = "+33757902900";

    mockSendTransacSms.mockReturnValue({
      withRawResponse: jest.fn().mockResolvedValue({ rawResponse: { status: 201 } }),
    });
  });

  it("formats the sender as an international number without a leading zero", async () => {
    const { sendSMS } = await import("./sendSMS");

    await sendSMS("Bonjour", "06 12 34 56 78");

    expect(mockSendTransacSms).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient: "+33612345678",
        sender: "33757902900",
      }),
    );
  });
});
