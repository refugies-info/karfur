import * as webhookUtils from "../../../../lib/webhookUtils";
import * as widgetConfigFilters from "../../../../lib/widgetConfigFilters";
import dispositifSearchHandler from "../../../../pages/api/webhook/dispositif/search";
import getByIdHandler from "../../../../pages/api/webhook/widget-config/[id]";
import createHandler from "../../../../pages/api/webhook/widget-config/create";
import listHandler from "../../../../pages/api/webhook/widget-config/index";
import previewCountHandler from "../../../../pages/api/webhook/widget-config/preview-count";
import updateHandler from "../../../../pages/api/webhook/widget-config/update";

jest.mock("../../../../lib/webhookUtils");
jest.mock("../../../../lib/widgetConfigFilters");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (overrides = {}) =>
  ({ method: "POST", headers: {}, query: {}, body: {}, ...overrides }) as any;

const objectId = (char: string) => char.repeat(24);
const structureName = "Ministère de l'Intérieur";
const widgetConfigId = objectId("b");
const userId = objectId("c");

const validCreateBody = () => ({
  email: "editor@refugies.info",
  widgetConfig: {
    internalTitle: "Widget Bordeaux",
    type: "list",
    structureName,
    authorizedDomains: ["exemple.org"],
    externalTitle: "Les fiches de Bordeaux",
    displayDescription: true,
    filters: { departments: ["Gironde"] },
    selectedDispositifIds: [],
    excludedDispositifIds: [],
    pageSize: 8,
    sortBy: "date",
    displayShareModule: true,
    displayFilterBar: true,
    filterBarOptions: ["keyword", "location"],
    status: "inactive",
  },
});

const chainable = (result: unknown) => {
  const chain: any = {};
  for (const method of ["sort", "select", "limit"])
    chain[method] = jest.fn().mockReturnValue(chain);
  chain.lean = jest.fn().mockResolvedValue(result);
  return chain;
};

describe("Widget config webhooks", () => {
  const user = { _id: userId };
  const models = {
    User: {},
    Structure: { find: jest.fn() },
    Dispositif: { find: jest.fn() },
    WidgetConfig: {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      updateOne: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (webhookUtils.authorizeWebhookRequest as jest.Mock).mockReturnValue(true);
    (webhookUtils.getAuthorizedWebhookUser as jest.Mock).mockResolvedValue(user);
    (webhookUtils.getWebhookModels as jest.Mock).mockResolvedValue(models);
    (webhookUtils.formatZodErrors as jest.Mock).mockImplementation((error) =>
      error.issues.map((issue: any) => ({ key: issue.path.join("."), message: issue.message })),
    );
  });

  describe("POST /api/webhook/widget-config/create", () => {
    it("stops when the request is not authorized", async () => {
      (webhookUtils.authorizeWebhookRequest as jest.Mock).mockReturnValue(false);
      const res = mockResponse();

      await createHandler(mockRequest({ body: validCreateBody() }), res);

      expect(models.WidgetConfig.create).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it.each([
      ["a missing title", { externalTitle: undefined }, "widgetConfig.externalTitle"],
      [
        "a title over 100 characters",
        { externalTitle: "a".repeat(101) },
        "widgetConfig.externalTitle",
      ],
      ["an unknown type", { type: "grid" }, "widgetConfig.type"],
      ["an empty structure name", { structureName: "  " }, "widgetConfig.structureName"],
      [
        "an invalid domain",
        { authorizedDomains: ["https://exemple.org/page"] },
        "widgetConfig.authorizedDomains.0",
      ],
      ["a page size not allowed", { pageSize: 10 }, "widgetConfig.pageSize"],
      ["an unknown sort", { sortBy: "random" }, "widgetConfig.sortBy"],
      ["an unknown filter key", { filters: { cityName: ["Bordeaux"] } }, "widgetConfig.filters"],
      [
        "an invalid theme id",
        { filters: { themes: ["not-an-id"] } },
        "widgetConfig.filters.themes.0",
      ],
      [
        "an unknown public value",
        { filters: { publics: ["aliens"] } },
        "widgetConfig.filters.publics.0",
      ],
      ["an unknown field", { createdBy: userId }, "widgetConfig"],
    ])("rejects %s", async (_label, override, key) => {
      const body = validCreateBody();
      Object.assign(body.widgetConfig, override);
      const res = mockResponse();

      await createHandler(mockRequest({ body }), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json.mock.calls[0][0].errors.map((e: any) => e.key)).toContain(key);
      expect(models.WidgetConfig.create).not.toHaveBeenCalled();
    });

    it("rejects a content that is both selected and excluded", async () => {
      const body = validCreateBody();
      Object.assign(body.widgetConfig, {
        selectedDispositifIds: [objectId("d")],
        excludedDispositifIds: [objectId("d")],
      });
      const res = mockResponse();

      await createHandler(mockRequest({ body }), res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it.each([
      "internalTitle",
      "type",
      "structureName",
      "authorizedDomains",
      "externalTitle",
      "displayDescription",
      "filters",
      "selectedDispositifIds",
      "excludedDispositifIds",
      "pageSize",
      "sortBy",
      "displayShareModule",
      "displayFilterBar",
      "filterBarOptions",
      "status",
    ])("requires %s", async (field) => {
      const body = validCreateBody();
      delete (body.widgetConfig as Record<string, unknown>)[field];
      const res = mockResponse();

      await createHandler(mockRequest({ body }), res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json.mock.calls[0][0].errors.map((e: any) => e.key)).toContain(
        `widgetConfig.${field}`,
      );
      expect(models.WidgetConfig.create).not.toHaveBeenCalled();
    });

    it("creates the widget with a public id and the status date", async () => {
      models.WidgetConfig.create.mockImplementation((data) =>
        Promise.resolve({ ...data, _id: widgetConfigId }),
      );
      const body = validCreateBody();
      const res = mockResponse();

      await createHandler(mockRequest({ body }), res);

      const created = models.WidgetConfig.create.mock.calls[0][0];
      expect(created).toMatchObject(body.widgetConfig);
      expect(created.description).toBeUndefined();
      expect(created.publicId).toEqual(expect.any(String));
      expect(created.statusUpdatedAt).toBeInstanceOf(Date);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: widgetConfigId, publicId: created.publicId }),
      );
    });

    it("normalizes the authorized domains", async () => {
      models.WidgetConfig.create.mockImplementation((data) =>
        Promise.resolve({ ...data, _id: widgetConfigId }),
      );
      const body = validCreateBody();
      Object.assign(body.widgetConfig, { authorizedDomains: ["  Exemple.ORG "] });
      const res = mockResponse();

      await createHandler(mockRequest({ body }), res);

      expect(models.WidgetConfig.create.mock.calls[0][0].authorizedDomains).toEqual([
        "exemple.org",
      ]);
    });
  });

  describe("POST /api/webhook/widget-config/update", () => {
    const stored = (overrides = {}) => ({
      _id: widgetConfigId,
      status: "inactive",
      selectedDispositifIds: [objectId("d")],
      excludedDispositifIds: [objectId("e")],
      ...overrides,
    });
    const updateBody = (widgetConfig: object) => ({
      email: "editor@refugies.info",
      widgetConfig: { _id: widgetConfigId, ...widgetConfig },
    });

    it("returns 404 when the widget does not exist", async () => {
      models.WidgetConfig.findById.mockReturnValue(chainable(null));
      const res = mockResponse();

      await updateHandler(mockRequest({ body: updateBody({ internalTitle: "New" }) }), res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(models.WidgetConfig.updateOne).not.toHaveBeenCalled();
    });

    it("requires a valid _id", async () => {
      const res = mockResponse();

      await updateHandler(mockRequest({ body: updateBody({ _id: "nope" }) }), res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("rejects selecting a content already excluded in the stored config", async () => {
      models.WidgetConfig.findById.mockReturnValue(chainable(stored()));
      const res = mockResponse();

      await updateHandler(
        mockRequest({ body: updateBody({ selectedDispositifIds: [objectId("e")] }) }),
        res,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(models.WidgetConfig.updateOne).not.toHaveBeenCalled();
    });

    it("only sets the sent fields", async () => {
      models.WidgetConfig.findById.mockReturnValue(chainable(stored()));
      const res = mockResponse();

      await updateHandler(mockRequest({ body: updateBody({ internalTitle: "Renamed" }) }), res);

      const [filter, update] = models.WidgetConfig.updateOne.mock.calls[0];
      expect(filter).toEqual({ _id: widgetConfigId });
      expect(update.$set).toEqual({ internalTitle: "Renamed" });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("refreshes statusUpdatedAt only when the status changes", async () => {
      models.WidgetConfig.findById.mockReturnValue(chainable(stored({ status: "inactive" })));

      await updateHandler(mockRequest({ body: updateBody({ status: "active" }) }), mockResponse());
      expect(models.WidgetConfig.updateOne.mock.calls[0][1].$set.statusUpdatedAt).toBeInstanceOf(
        Date,
      );

      models.WidgetConfig.updateOne.mockClear();
      await updateHandler(
        mockRequest({ body: updateBody({ status: "inactive" }) }),
        mockResponse(),
      );
      expect(models.WidgetConfig.updateOne.mock.calls[0][1].$set).not.toHaveProperty(
        "statusUpdatedAt",
      );
    });

    it("accepts a new structure name", async () => {
      models.WidgetConfig.findById.mockReturnValue(chainable(stored()));
      const res = mockResponse();

      await updateHandler(
        mockRequest({ body: updateBody({ structureName: "  Association Poya " }) }),
        res,
      );

      expect(models.WidgetConfig.updateOne.mock.calls[0][1].$set.structureName).toBe(
        "Association Poya",
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("GET /api/webhook/widget-config", () => {
    it("lists the widgets", async () => {
      const widgetConfigs = [{ _id: widgetConfigId, publicId: "p1", internalTitle: "Widget" }];
      models.WidgetConfig.find.mockReturnValue(chainable(widgetConfigs));
      const res = mockResponse();

      await listHandler(mockRequest({ method: "GET" }), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(widgetConfigs);
    });
  });

  describe("GET /api/webhook/widget-config/[id]", () => {
    it("rejects an invalid id", async () => {
      const res = mockResponse();

      await getByIdHandler(mockRequest({ method: "GET", query: { id: "nope" } }), res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 404 when not found", async () => {
      models.WidgetConfig.findById.mockReturnValue(chainable(null));
      const res = mockResponse();

      await getByIdHandler(mockRequest({ method: "GET", query: { id: widgetConfigId } }), res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("returns the widget", async () => {
      const widgetConfig = { _id: widgetConfigId, publicId: "p1", structureName };
      models.WidgetConfig.findById.mockReturnValue(chainable(widgetConfig));
      const res = mockResponse();

      await getByIdHandler(mockRequest({ method: "GET", query: { id: widgetConfigId } }), res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(widgetConfig);
    });
  });

  describe("POST /api/webhook/widget-config/preview-count", () => {
    it("rejects unknown filters", async () => {
      const res = mockResponse();

      await previewCountHandler(mockRequest({ body: { filters: { zipCode: ["33000"] } } }), res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns the number of contents matching the filters", async () => {
      (widgetConfigFilters.countWidgetFilterMatches as jest.Mock).mockResolvedValue(5);
      const filters = { departments: ["Gironde"], themes: [objectId("1")] };
      const res = mockResponse();

      await previewCountHandler(mockRequest({ body: { filters } }), res);

      expect(widgetConfigFilters.countWidgetFilterMatches).toHaveBeenCalledWith(
        models.Dispositif,
        filters,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ count: 5 });
    });
  });

  describe("GET /api/webhook/dispositif/search", () => {
    const sponsorId = objectId("9");
    const dispositif = {
      _id: objectId("d"),
      typeContenu: "dispositif",
      status: "Actif",
      mainSponsor: sponsorId,
      translations: {
        fr: { content: { titreInformatif: "Avoir une carte de séjour", titreMarque: "Titre" } },
      },
    };

    beforeEach(() => {
      models.Dispositif.find.mockReturnValue(chainable([dispositif]));
      models.Structure.find.mockReturnValue(
        chainable([{ _id: sponsorId, nom: "Ministère de l'Intérieur" }]),
      );
    });

    it("requires q or ids", async () => {
      const res = mockResponse();

      await dispositifSearchHandler(mockRequest({ method: "GET" }), res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("rejects invalid ids", async () => {
      const res = mockResponse();

      await dispositifSearchHandler(
        mockRequest({ method: "GET", query: { ids: `${objectId("d")},nope` } }),
        res,
      );

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("searches active contents by title, escaping regex characters", async () => {
      const res = mockResponse();

      await dispositifSearchHandler(
        mockRequest({ method: "GET", query: { q: "carte (séjour" } }),
        res,
      );

      const filter = models.Dispositif.find.mock.calls[0][0];
      expect(filter.status).toBe("Actif");
      expect(filter.$or[0]["translations.fr.content.titreInformatif"].source).toBe(
        "carte \\(séjour",
      );
      expect(res.json).toHaveBeenCalledWith([
        {
          id: objectId("d"),
          type: "dispositif",
          status: "Actif",
          titreInformatif: "Avoir une carte de séjour",
          titreMarque: "Titre",
          sponsorName: "Ministère de l'Intérieur",
        },
      ]);
    });

    it("finds a content by its id whatever its status", async () => {
      const res = mockResponse();

      await dispositifSearchHandler(
        mockRequest({ method: "GET", query: { q: objectId("d") } }),
        res,
      );

      expect(models.Dispositif.find).toHaveBeenCalledWith({ _id: objectId("d") });
    });

    it("resolves a list of ids", async () => {
      const ids = [objectId("d"), objectId("e")];
      const res = mockResponse();

      await dispositifSearchHandler(
        mockRequest({ method: "GET", query: { ids: ids.join(",") } }),
        res,
      );

      expect(models.Dispositif.find).toHaveBeenCalledWith({ _id: { $in: ids } });
    });
  });
});
