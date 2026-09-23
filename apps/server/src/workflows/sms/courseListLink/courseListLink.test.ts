import type { CourseListLinkRequest } from "@refugies-info/api-types";
import { InvalidRequestError, ServiceUnavailableError } from "~/errors";
import logger from "~/logger";
import { sendSMS } from "~/services";
import { courseListLink } from "./courseListLink";

jest.mock("~/services");
jest.mock("~/logger");

const mockSendSMS = sendSMS as jest.Mock;

const bodyWithLocation: CourseListLinkRequest = {
  phone: "+33600000000",
  url: "https://example.com/trouver-cours-francais",
  locale: "fr",
  location: "Gironde",
};

const bodyWithoutLocation: CourseListLinkRequest = {
  phone: "+33600000000",
  url: "https://example.com/trouver-cours-francais",
  locale: "fr",
};

describe("courseListLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends the course list link with the location when one is provided", async () => {
    mockSendSMS.mockResolvedValue({ status: 201, sent: true });

    await expect(courseListLink(bodyWithLocation)).resolves.toEqual({ text: "success" });
    expect(mockSendSMS).toHaveBeenCalledWith(
      "Bonjour, voici les cours de français disponibles dans le Gironde : https://example.com/trouver-cours-francais",
      "+33600000000",
    );
  });

  it("sends the course list link without a location when none is provided", async () => {
    mockSendSMS.mockResolvedValue({ status: 201, sent: true });

    await expect(courseListLink(bodyWithoutLocation)).resolves.toEqual({ text: "success" });
    expect(mockSendSMS).toHaveBeenCalledWith(
      "Bonjour, voici les cours de français disponibles : https://example.com/trouver-cours-francais",
      "+33600000000",
    );
  });

  it("throws InvalidRequestError when the SMS request is invalid", async () => {
    mockSendSMS.mockResolvedValue({ status: 400, sent: false });

    await expect(courseListLink(bodyWithLocation)).rejects.toThrow(InvalidRequestError);
  });

  it("logs and throws ServiceUnavailableError for SMS provider failures", async () => {
    mockSendSMS.mockResolvedValue({ status: 401, sent: false });

    await expect(courseListLink(bodyWithLocation)).rejects.toThrow(ServiceUnavailableError);
    await expect(courseListLink(bodyWithLocation)).rejects.toThrow(
      "[courseListLink] SMS provider unavailable",
    );
    expect(logger.error).toHaveBeenCalledWith("[courseListLink] SMS not sent", {
      sent: false,
      status: 401,
    });
  });
});
