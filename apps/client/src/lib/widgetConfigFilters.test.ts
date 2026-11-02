import { ContentType } from "@refugies-info/api-types";
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

  it("restricts to the content type when only one is selected", async () => {
    const { model, countDocuments } = fakeDispositifModel(2);

    await countWidgetFilterMatches(model, { contentTypes: [ContentType.DEMARCHE] });

    expect(countDocuments.mock.calls[0][0].typeContenu).toBe(ContentType.DEMARCHE);
  });

  it("does not restrict the type when both are selected", async () => {
    const { model, countDocuments } = fakeDispositifModel(2);

    await countWidgetFilterMatches(model, {
      contentTypes: [ContentType.DISPOSITIF, ContentType.DEMARCHE],
    });

    expect(countDocuments.mock.calls[0][0].typeContenu).toBeUndefined();
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
