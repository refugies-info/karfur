import crypto from "crypto";
import dbConnect from "./db";
import * as webhookUtils from "./webhookUtils";

jest.mock("./db");
jest.mock("crypto", () => ({
  ...jest.requireActual("crypto"),
  timingSafeEqual: jest.fn(),
}));

describe("Webhook Utilities", () => {
  describe("validateWebhookSecret", () => {
    const mockSecret = "correct-secret";

    beforeEach(() => {
      process.env.WEBHOOK_SECRET = mockSecret;
      jest.clearAllMocks();
    });

    it("should return true for valid secret", () => {
      const req: any = { headers: { "webhook-secret": mockSecret } };
      (crypto.timingSafeEqual as jest.Mock).mockReturnValue(true);
      expect(webhookUtils.validateWebhookSecret(req)).toBe(true);
    });

    it("should return false if secret header is missing", () => {
      const req: any = { headers: {} };
      expect(webhookUtils.validateWebhookSecret(req)).toBe(false);
    });

    it("should return false if expected secret is missing in env", () => {
      delete process.env.WEBHOOK_SECRET;
      const req: any = { headers: { "webhook-secret": mockSecret } };
      expect(webhookUtils.validateWebhookSecret(req)).toBe(false);
    });

    it("should return false if secrets have different lengths", () => {
      const req: any = { headers: { "webhook-secret": "short" } };
      expect(webhookUtils.validateWebhookSecret(req)).toBe(false);
    });
  });

  describe("getWebhookUser", () => {
    it("should return user if found", async () => {
      const mockUser = { email: "test@test.com" };
      const User: any = { findOne: jest.fn().mockResolvedValue(mockUser) };
      const user = await webhookUtils.getWebhookUser(User, "test@test.com");
      expect(user).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    });
  });

  describe("getThemeIdsByNames", () => {
    it("should return theme IDs for found names", async () => {
      const mockThemes = [
        { _id: "id1", name: { fr: "Theme 1" } },
        { _id: "id2", name: { fr: "Theme 2" } },
      ];
      const Theme: any = {
        find: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(mockThemes),
        }),
      };
      const ids = await webhookUtils.getThemeIdsByNames(Theme, ["Theme 1", "Theme 2", "Unknown"]);
      expect(ids).toEqual(["id1", "id2"]);
    });

    it("should be case-insensitive", async () => {
      const mockThemes = [{ _id: "id1", name: { fr: "Theme 1" } }];
      const Theme: any = {
        find: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(mockThemes),
        }),
      };
      const ids = await webhookUtils.getThemeIdsByNames(Theme, ["theme 1"]);
      expect(ids).toEqual(["id1"]);
    });
  });
});
