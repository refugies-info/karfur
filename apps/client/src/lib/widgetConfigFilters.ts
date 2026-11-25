import type { WidgetConfigContentType } from "@refugies-info/api-types";
import type { Model } from "mongoose";
import { buildBaseMatch, executeCachedQuery } from "./search-helpers";
import type { WidgetConfigFiltersInput } from "./widgetConfigWebhookSchema";

const buildContentTypeMatch = (contentTypes: WidgetConfigContentType[]) => {
  if (contentTypes.includes("demarche") && contentTypes.includes("dispositif")) return null;
  const clauses = contentTypes.map((contentType) =>
    contentType === "online" ? { "metadatas.location": "online" } : { typeContenu: contentType },
  );
  return clauses.length > 0 ? { $or: clauses } : null;
};

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

  const contentTypeMatch = buildContentTypeMatch(filters.contentTypes ?? []);
  if (contentTypeMatch) {
    match.$and = [...(match.$and ?? []), contentTypeMatch];
  }

  return executeCachedQuery<number>(Dispositif.countDocuments(match));
};
