import { countWidgetFilterMatches } from "./widgetConfigFilters";
import type { WidgetConfigFiltersInput } from "./widgetConfigWebhookSchema";

const fakeDispositifModel = (count: number) => {
  const countDocuments = jest.fn().mockReturnValue({ exec: () => Promise.resolve(count) });
  return { model: { countDocuments } as any, countDocuments };
};

describe("countWidgetFilterMatches", () => {
  it("counts published contents matching the filters", async () => {
    const { model, countDocuments } = fakeDispositifModel(5);

    const count = await countWidgetFilterMatches(model, { departments: ["Gironde"] });

    expect(count).toBe(5);
    const match = countDocuments.mock.calls[0][0];
    expect(match.status).toBe("Actif");
    const locations: (string | RegExp)[] = match["metadatas.location"].$in;
    expect(locations).toContain("france");
    expect(
      locations.some((location) => location instanceof RegExp && location.test("33 - Gironde")),
    ).toBe(true);
    expect(match.typeContenu).toBeUndefined();
  });

  it.each<[string, WidgetConfigFiltersInput["contentTypes"], object[]]>([
    ["a single type", ["demarche"], [{ typeContenu: "demarche" }]],
    ["online resources", ["online"], [{ "metadatas.location": "online" }]],
    [
      "a type or online resources",
      ["dispositif", "online"],
      [{ typeContenu: "dispositif" }, { "metadatas.location": "online" }],
    ],
  ])("restricts to %s", async (_case, contentTypes, expected) => {
    const { model, countDocuments } = fakeDispositifModel(2);

    await countWidgetFilterMatches(model, { contentTypes });

    expect(countDocuments.mock.calls[0][0].$and).toContainEqual({ $or: expected });
  });

  it("does not restrict the type when demarches and dispositifs are selected", async () => {
    const { model, countDocuments } = fakeDispositifModel(2);

    await countWidgetFilterMatches(model, {
      contentTypes: ["dispositif", "demarche", "online"],
    });

    expect(countDocuments.mock.calls[0][0].$and).toBeUndefined();
  });

  it("keeps the departments filter along with online resources", async () => {
    const { model, countDocuments } = fakeDispositifModel(2);

    await countWidgetFilterMatches(model, {
      contentTypes: ["online"],
      departments: ["Gironde"],
    });

    const match = countDocuments.mock.calls[0][0];
    expect(match["metadatas.location"].$in).toContain("france");
    expect(match.$and).toContainEqual({ $or: [{ "metadatas.location": "online" }] });
  });

  it.each<[string, WidgetConfigFiltersInput]>([
    ["departments", { departments: ["Gironde"] }],
    ["themes", { themes: ["a".repeat(24)] }],
    ["needs", { needs: ["a".repeat(24)] }],
    ["publics", { publics: ["women"] }],
    ["statuses", { statuses: ["asile"] }],
    ["frenchLevels", { frenchLevels: ["a"] }],
    ["ages", { ages: ["18-25"] }],
    ["languages", { languages: ["ar"] }],
  ])("applies the %s filter", async (_category, filters) => {
    const { model, countDocuments } = fakeDispositifModel(1);

    await countWidgetFilterMatches(model, filters);

    expect(Object.keys(countDocuments.mock.calls[0][0]).length).toBeGreaterThan(1);
  });
});
