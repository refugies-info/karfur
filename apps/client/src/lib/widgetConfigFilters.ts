import type { Model } from "mongoose";
import { buildBaseMatch, executeCachedQuery } from "./search-helpers";
import type { WidgetConfigFiltersInput } from "./widgetConfigWebhookSchema";

export const countWidgetFilterMatches = async (
  Dispositif: Model<any>,
  filters: WidgetConfigFiltersInput,
): Promise<number> => {
  const match = buildBaseMatch({
    departments: filters.departments,
    themes: filters.themes,
    needs: filters.needs,
    public: filters.publics,
    status: filters.statuses,
    frenchLevel: filters.frenchLevels,
    age: filters.ages,
    language: filters.languages,
  });

  // Both content types selected is the same as no restriction
  if (filters.contentTypes?.length === 1) {
    match.typeContenu = filters.contentTypes[0];
  }

  return executeCachedQuery<number>(Dispositif.countDocuments(match));
};
