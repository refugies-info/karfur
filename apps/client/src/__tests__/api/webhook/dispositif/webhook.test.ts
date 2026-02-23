import { ContentType, DispositifOrigin, DispositifStatus } from "@refugies-info/api-types";
import * as webhookUtils from "../../../../lib/webhookUtils";
import archiveHandler from "../../../../pages/api/webhook/dispositif/archive";
import createHandler from "../../../../pages/api/webhook/dispositif/create";
import translationHandler from "../../../../pages/api/webhook/dispositif/translation";
import updateHandler from "../../../../pages/api/webhook/dispositif/update";
import needsHandler from "../../../../pages/api/webhook/needs";
import themesHandler from "../../../../pages/api/webhook/themes";

jest.mock("../../../../lib/webhookUtils");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res._getStatusCode = () => res.status.mock.calls[0][0];
  res._getData = () => JSON.stringify(res.json.mock.calls[0][0]);
  return res;
};

const mockRequest = (overrides = {}) => {
  return {
    method: "POST",
    headers: {},
    body: {},
    ...overrides,
  } as any;
};

describe("Webhook API Endpoints", () => {
  const mockEmail = "test@refugies.info";
  const mockUser = { _id: "user123", email: mockEmail };
  const mockSecret = "correct-secret";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.WEBHOOK_SECRET = mockSecret;

    // Default mocks
    (webhookUtils.validateWebhookSecret as jest.Mock).mockReturnValue(true);
    (webhookUtils.getWebhookModels as jest.Mock).mockResolvedValue({
      User: { findOne: jest.fn().mockResolvedValue(mockUser) },
      Dispositif: {
        create: jest.fn().mockImplementation((data) => Promise.resolve({ ...data, _id: "newId" })),
        findByIdAndUpdate: jest.fn().mockResolvedValue({ _id: "507f1f77bcf86cd799439011" }),
      },
      Theme: {
        find: jest.fn().mockReturnValue({
          collation: jest.fn().mockReturnThis(),
          sort: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue([
            { _id: "theme1", name: { fr: "Apprendre le français" } },
            { _id: "theme2", name: { fr: "Santé" } },
          ]),
        }),
      },
      Need: {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnThis(),
          select: jest.fn().mockResolvedValue([
            {
              _id: "need1",
              fr: { text: "Je veux apprendre le français" },
              theme: { _id: "theme1" },
            },
            { _id: "need2", fr: { text: "Je cherche un emploi" }, theme: { _id: "theme2" } },
          ]),
        }),
      },
      Log: {
        create: jest.fn().mockResolvedValue({}),
      },
    });
    (webhookUtils.getWebhookUser as jest.Mock).mockResolvedValue({
      ...mockUser,
      roles: [{ nom: "Admin" }],
    });
    (webhookUtils.getThemeIdsByNames as jest.Mock).mockResolvedValue(["theme1", "theme2"]);
    (webhookUtils.validateSourceIP as jest.Mock).mockReturnValue(true);
    // Restoration of the real checkWebhookPermissions function to test it
    const originalUtils = jest.requireActual("../../../../lib/webhookUtils");
    (webhookUtils.checkWebhookPermissions as jest.Mock).mockImplementation(
      originalUtils.checkWebhookPermissions,
    );
  });

  describe("POST /api/webhook/dispositif/create", () => {
    it("should create a new dispositif successfully with origin and resolved themes", async () => {
      const req = mockRequest({
        method: "POST",
        headers: { "webhook-secret": mockSecret },
        body: {
          email: mockEmail,
          dispositif: {
            origin: DispositifOrigin.RI,
            themes: ["Apprendre le français", "Santé"],
            translations: {
              fr: {
                content: {
                  titreInformatif: "Title",
                  markdown: "MD",
                },
              },
            },
          },
        },
      });
      const res = mockResponse();

      await createHandler(req, res);

      expect(res._getStatusCode()).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data.message).toBe("Dispositif created successfully");
      expect(data.id).toBe("newId");

      // Verify origin and resolved themes were passed to create
      const { Dispositif } = await webhookUtils.getWebhookModels();
      expect(Dispositif.create).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: DispositifOrigin.RI,
          theme: "theme1",
          secondaryThemes: ["theme2"],
          status: DispositifStatus.ACTIVE,
        }),
      );
    });

    it("should return 401 if secret is invalid", async () => {
      (webhookUtils.validateWebhookSecret as jest.Mock).mockReturnValue(false);
      const req = mockRequest({ method: "POST" });
      const res = mockResponse();
      await createHandler(req, res);
      expect(res._getStatusCode()).toBe(401);
    });

    it("should return 403 if IP is not allowed", async () => {
      (webhookUtils.validateSourceIP as jest.Mock).mockReturnValue(false);
      const req = mockRequest({ method: "POST" });
      const res = mockResponse();
      await createHandler(req, res);
      expect(res._getStatusCode()).toBe(403);
      expect(JSON.parse(res._getData()).message).toBe("Accès refusé : IP non autorisée");
    });

    it("should return 403 if user has insufficient roles (TRAD trying to create)", async () => {
      (webhookUtils.getWebhookUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        roles: [{ nom: "Trad" }],
      });

      const req = mockRequest({
        method: "POST",
        body: {
          email: mockEmail,
          dispositif: { titreInformatif: "Title", origin: DispositifOrigin.RI },
        },
      });
      const res = mockResponse();
      await createHandler(req, res);
      expect(res._getStatusCode()).toBe(403);
      expect(JSON.parse(res._getData()).message).toBe(
        "Accès refusé. Rôle requis : Admin ou Contrib",
      );
    });

    it("should allow CONTRIB to create", async () => {
      (webhookUtils.getWebhookUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        roles: [{ nom: "Contrib" }],
      });

      const req = mockRequest({
        method: "POST",
        headers: { "webhook-secret": mockSecret },
        body: {
          email: mockEmail,
          dispositif: {
            origin: DispositifOrigin.RI,
            themes: ["Apprendre le français", "Santé"],
            translations: {
              fr: {
                content: {
                  titreInformatif: "Title",
                  markdown: "MD",
                },
              },
            },
          },
        },
      });
      const res = mockResponse();

      await createHandler(req, res);
      expect(res._getStatusCode()).toBe(201);
    });

    it("should return 400 if payload is invalid (Zod error)", async () => {
      const req = mockRequest({
        method: "POST",
        body: {
          email: "invalid-email",
          dispositif: {},
        },
      });
      const res = mockResponse();
      await createHandler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData()).message).toBe("Invalid payload");
    });
  });

  describe("POST /api/webhook/dispositif/update", () => {
    it("should update a dispositif successfully with resolved themes", async () => {
      const req = mockRequest({
        method: "POST",
        body: {
          email: mockEmail,
          dispositif: {
            _id: "507f1f77bcf86cd799439011",
            themes: ["Santé"],
            translations: {
              fr: {
                content: { titreInformatif: "Updated" },
              },
            },
          },
        },
      });
      const res = mockResponse();

      await updateHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData()).message).toBe("Dispositif updated successfully");

      const { Dispositif } = await webhookUtils.getWebhookModels();
      expect(Dispositif.findByIdAndUpdate).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011",
        expect.objectContaining({
          $set: expect.objectContaining({
            theme: "theme1", // Based on getThemeIdsByNames mock in beforeEach
          }),
        }),
      );
    });
  });

  describe("POST /api/webhook/dispositif/translation", () => {
    it("should update a translation successfully", async () => {
      const req = mockRequest({
        method: "POST",
        body: {
          email: mockEmail,
          dispositif: {
            _id: "507f1f77bcf86cd799439011",
            translations: {
              uk: {
                content: { titreInformatif: "UK Title" },
              },
            },
          },
        },
      });
      const res = mockResponse();

      await translationHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData()).message).toBe("Translation updated successfully");
    });

    it("should return 400 if more than one language is provided", async () => {
      const req = mockRequest({
        method: "POST",
        body: {
          email: mockEmail,
          dispositif: {
            _id: "507f1f77bcf86cd799439011",
            translations: {
              uk: { content: {} },
              en: { content: {} },
            },
          },
        },
      });
      const res = mockResponse();

      await translationHandler(req, res);
      expect(res._getStatusCode()).toBe(400);
    });
  });

  describe("POST /api/webhook/dispositif/archive", () => {
    it("should archive a dispositif successfully", async () => {
      const req = mockRequest({
        method: "POST",
        body: {
          email: mockEmail,
          dispositif: {
            _id: "507f1f77bcf86cd799439011",
          },
        },
      });
      const res = mockResponse();

      await archiveHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData()).message).toBe("Dispositif archived successfully");

      const { Dispositif } = await webhookUtils.getWebhookModels();
      expect(Dispositif.findByIdAndUpdate).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011",
        expect.objectContaining({
          $set: expect.objectContaining({
            status: DispositifStatus.ARCHIVED,
          }),
        }),
      );
    });
  });

  describe("GET /api/webhook/themes", () => {
    it("should return 405 if method is not GET", async () => {
      const req = mockRequest({ method: "POST" });
      const res = mockResponse();
      await themesHandler(req, res);
      expect(res._getStatusCode()).toBe(405);
    });

    it("should return 401 if secret is invalid", async () => {
      (webhookUtils.validateWebhookSecret as jest.Mock).mockReturnValue(false);
      const req = mockRequest({ method: "GET" });
      const res = mockResponse();
      await themesHandler(req, res);
      expect(res._getStatusCode()).toBe(401);
    });

    it("should return 200 with the list of themes in id/name format", async () => {
      const req = mockRequest({ method: "GET" });
      const res = mockResponse();
      await themesHandler(req, res);
      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data).toEqual([
        { id: "theme1", name: "Apprendre le français" },
        { id: "theme2", name: "Santé" },
      ]);
    });
  });

  describe("GET /api/webhook/needs", () => {
    it("should return 405 if method is not GET", async () => {
      const req = mockRequest({ method: "POST" });
      const res = mockResponse();
      await needsHandler(req, res);
      expect(res._getStatusCode()).toBe(405);
    });

    it("should return 401 if secret is invalid", async () => {
      (webhookUtils.validateWebhookSecret as jest.Mock).mockReturnValue(false);
      const req = mockRequest({ method: "GET" });
      const res = mockResponse();
      await needsHandler(req, res);
      expect(res._getStatusCode()).toBe(401);
    });

    it("should return 200 with the list of needs in id/name/themeId format", async () => {
      const req = mockRequest({ method: "GET" });
      const res = mockResponse();
      await needsHandler(req, res);
      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data).toEqual([
        { id: "need1", name: "Je veux apprendre le français", themeId: "theme1" },
        { id: "need2", name: "Je cherche un emploi", themeId: "theme2" },
      ]);
    });
  });
});
