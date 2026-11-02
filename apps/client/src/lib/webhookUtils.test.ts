import { RoleModel } from "@refugies-info/mongo";
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

  describe("authorizeWebhookRequest", () => {
    const mockResponse = () => {
      const res: any = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    beforeEach(() => {
      process.env.WEBHOOK_SECRET = "correct-secret";
      delete process.env.ALLOWED_WEBHOOK_IPS;
      (crypto.timingSafeEqual as jest.Mock).mockReturnValue(true);
    });

    it("rejects a method that is not allowed", () => {
      const res = mockResponse();
      const req: any = { method: "GET", headers: { "webhook-secret": "correct-secret" } };
      expect(webhookUtils.authorizeWebhookRequest(req, res, ["POST"])).toBe(false);
      expect(res.status).toHaveBeenCalledWith(405);
    });

    it("rejects a missing secret", () => {
      const res = mockResponse();
      const req: any = { method: "POST", headers: {} };
      expect(webhookUtils.authorizeWebhookRequest(req, res, ["POST"])).toBe(false);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("rejects an IP that is not allowed", () => {
      process.env.ALLOWED_WEBHOOK_IPS = "1.1.1.1";
      const res = mockResponse();
      const req: any = {
        method: "POST",
        headers: { "webhook-secret": "correct-secret", "x-forwarded-for": "2.2.2.2" },
      };
      expect(webhookUtils.authorizeWebhookRequest(req, res, ["POST"])).toBe(false);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("lets a valid request through without answering", () => {
      const res = mockResponse();
      const req: any = { method: "PATCH", headers: { "webhook-secret": "correct-secret" } };
      expect(webhookUtils.authorizeWebhookRequest(req, res, ["POST", "PATCH"])).toBe(true);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("getAuthorizedWebhookUser", () => {
    const mockResponse = () => {
      const res: any = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    it("answers 404 when the user does not exist", async () => {
      const res = mockResponse();
      const User: any = { findOne: jest.fn().mockResolvedValue(null) };
      expect(await webhookUtils.getAuthorizedWebhookUser(res, User, "a@b.fr", "create")).toBeNull();
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("answers 403 when the user has no allowed role", async () => {
      const res = mockResponse();
      const User: any = { findOne: jest.fn().mockResolvedValue({ roles: [] }) };
      expect(await webhookUtils.getAuthorizedWebhookUser(res, User, "a@b.fr", "create")).toBeNull();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("returns the user when they are admin", async () => {
      const res = mockResponse();
      const user = { roles: ["role1"] };
      const User: any = { findOne: jest.fn().mockResolvedValue(user) };
      jest.spyOn(RoleModel, "find").mockResolvedValueOnce([{ nom: "Admin" }] as any);
      expect(await webhookUtils.getAuthorizedWebhookUser(res, User, "a@b.fr", "create")).toBe(user);
      expect(res.status).not.toHaveBeenCalled();
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
          collation: jest.fn().mockReturnThis(),
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
          collation: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue(mockThemes),
        }),
      };
      const ids = await webhookUtils.getThemeIdsByNames(Theme, ["theme 1"]);
      expect(ids).toEqual(["id1"]);
    });
  });
});
