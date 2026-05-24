import type { DownloadAppRequest } from "@refugies-info/api-types";
import { InvalidRequestError, ServiceUnavailableError } from "~/errors";
import logger from "~/logger";
import { sendSMS } from "~/services";
import { downloadApp } from "./downloadApp";

jest.mock("~/services");
jest.mock("~/logger");

const mockSendSMS = sendSMS as jest.Mock;

const body: DownloadAppRequest = {
  phone: "+33600000000",
  locale: "fr",
};

describe("downloadApp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends the app download link by SMS", async () => {
    mockSendSMS.mockResolvedValue({ status: 201, sent: true });

    await expect(downloadApp(body)).resolves.toEqual({ text: "success" });
    expect(mockSendSMS).toHaveBeenCalledWith(
      "Voici le lien pour télécharger l'application Réfugiés.info : https://refugies.info/fr/download-app",
      "+33600000000",
    );
  });

  it("throws InvalidRequestError when the SMS request is invalid", async () => {
    mockSendSMS.mockResolvedValue({ status: 400, sent: false });

    await expect(downloadApp(body)).rejects.toThrow(InvalidRequestError);
  });

  it("logs and throws ServiceUnavailableError for SMS provider failures", async () => {
    mockSendSMS.mockResolvedValue({ status: 401, sent: false });

    await expect(downloadApp(body)).rejects.toThrow(ServiceUnavailableError);
    await expect(downloadApp(body)).rejects.toThrow("[downloadApp] SMS provider unavailable");
    expect(logger.error).toHaveBeenCalledWith("[downloadApp] SMS not sent", {
      sent: false,
      status: 401,
    });
  });
});
