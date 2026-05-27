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
  let originalBrevoApiKey: string | undefined;
  let originalSmsSender: string | undefined;

  beforeEach(() => {
    originalBrevoApiKey = process.env.BREVO_API_KEY;
    originalSmsSender = process.env.SMS_SENDER;

    jest.resetModules();
    jest.clearAllMocks();
    process.env.BREVO_API_KEY = "brevo-api-key";
    process.env.SMS_SENDER = "+33757902900";

    mockSendTransacSms.mockReturnValue({
      withRawResponse: jest.fn().mockResolvedValue({ rawResponse: { status: 201 } }),
    });
  });

  afterEach(() => {
    if (originalBrevoApiKey === undefined) {
      delete process.env.BREVO_API_KEY;
    } else {
      process.env.BREVO_API_KEY = originalBrevoApiKey;
    }
    if (originalSmsSender === undefined) {
      delete process.env.SMS_SENDER;
    } else {
      process.env.SMS_SENDER = originalSmsSender;
    }
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
