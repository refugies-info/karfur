import type { ContentLinkRequest } from "@refugies-info/api-types";
import { InternalError, NotFoundError } from "~/errors";
import { getDispositifByIdWithAllFields } from "~/modules/dispositif/dispositif.repository";
import { sendSMS } from "~/services";
import { contentLink } from "./contentLink";

// Mocks
jest.mock("~/modules/dispositif/dispositif.repository");
jest.mock("~/services");
jest.mock("~/logger");

const mockGetDispositif = getDispositifByIdWithAllFields as jest.Mock;
const mockSendSMS = sendSMS as jest.Mock;

const validDispositif = {
  _id: "valid_id",
  translations: {
    fr: {
      content: {
        titreInformatif: "Titre Français",
      },
    },
  },
};

const incompleteDispositif = {
  _id: "incomplete_id",
  translations: {
    // No 'fr' and no requested locale
  },
};

const emptyTitleDispositif = {
  _id: "empty_title_id",
  translations: {
    fr: {
      content: {
        titreInformatif: "", // Empty
      },
    },
  },
};

describe("contentLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send SMS successfully when data is valid", async () => {
    mockGetDispositif.mockResolvedValue(validDispositif);
    mockSendSMS.mockResolvedValue({ status: 201, sent: true });

    const body: ContentLinkRequest = {
      id: "valid_id",
      phone: "+33600000000",
      url: "https://example.com",
      locale: "fr",
    };

    const res = await contentLink(body);
    expect(res).toEqual({ text: "success" });
    expect(mockSendSMS).toHaveBeenCalled();
  });

  it("should throw NotFoundError if translations are missing", async () => {
    mockGetDispositif.mockResolvedValue(incompleteDispositif);
    const body: ContentLinkRequest = {
      id: "incomplete_id",
      phone: "+33600000000",
      url: "https://example.com",
      locale: "fr",
    };
    await expect(contentLink(body)).rejects.toThrow(NotFoundError);
  });

  it("should throw NotFoundError if title is empty", async () => {
    mockGetDispositif.mockResolvedValue(emptyTitleDispositif);
    const body: ContentLinkRequest = {
      id: "empty_title_id",
      phone: "+33600000000",
      url: "https://example.com",
      locale: "fr",
    };
    await expect(contentLink(body)).rejects.toThrow(NotFoundError);
  });

  it("should throw InternalError if SMS sending fails with non-400 status", async () => {
    mockGetDispositif.mockResolvedValue(validDispositif);
    mockSendSMS.mockResolvedValue({ status: 401, sent: false });

    const body: ContentLinkRequest = {
      id: "valid_id",
      phone: "+33600000000",
      url: "https://example.com",
      locale: "fr",
    };

    await expect(contentLink(body)).rejects.toThrow(InternalError);
    await expect(contentLink(body)).rejects.toThrow("[contentLink] SMS not sent. Status: 401");
  });
});
