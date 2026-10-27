import {
  ContentType,
  PUBLIC_STATUS_TYPES,
  PUBLIC_TYPES,
  SEARCH_AGE_OPTIONS,
  SEARCH_FRENCH_LEVEL_OPTIONS,
  WIDGET_CONFIG_FILTER_BAR_OPTIONS,
  WIDGET_CONFIG_MAX_MANUAL_DISPOSITIFS,
  WIDGET_CONFIG_PAGE_SIZES,
  WIDGET_CONFIG_SORT_OPTIONS,
  WIDGET_CONFIG_STATUSES,
  WIDGET_CONFIG_TYPES,
} from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, type Model, model, models, type Types } from "mongoose";
import { z } from "zod";
import { I18nCodeZodSchema } from "./Langue";

const isAllowedPageSize = (value: number) =>
  (WIDGET_CONFIG_PAGE_SIZES as readonly number[]).includes(value);

const WidgetConfigFiltersZodSchema = z.object({
  contentTypes: z.array(z.nativeEnum(ContentType)).optional(),
  departments: z.array(z.string()).optional(),
  themes: z.array(zId("Theme")).optional(),
  needs: z.array(zId("Need")).optional(),
  publics: z.array(z.enum(PUBLIC_TYPES)).optional(),
  statuses: z.array(z.enum(PUBLIC_STATUS_TYPES)).optional(),
  frenchLevels: z.array(z.enum(SEARCH_FRENCH_LEVEL_OPTIONS)).optional(),
  ages: z.array(z.enum(SEARCH_AGE_OPTIONS)).optional(),
  languages: z.array(I18nCodeZodSchema).optional(),
});

const WidgetConfigZodSchema = z.object({
  publicId: z.string(),

  status: z.enum(WIDGET_CONFIG_STATUSES),
  statusUpdatedAt: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),

  internalTitle: z.string(),
  type: z.enum(WIDGET_CONFIG_TYPES),
  structureName: z.string(),
  authorizedDomains: z.array(z.string()),

  externalTitle: z.string().max(100),
  description: z.string().max(300).optional(),
  displayDescription: z.boolean(),

  filters: WidgetConfigFiltersZodSchema,
  selectedDispositifIds: z.array(zId("Dispositif")).max(WIDGET_CONFIG_MAX_MANUAL_DISPOSITIFS),
  excludedDispositifIds: z.array(zId("Dispositif")).max(WIDGET_CONFIG_MAX_MANUAL_DISPOSITIFS),

  pageSize: z.number().refine(isAllowedPageSize),
  sortBy: z.enum(WIDGET_CONFIG_SORT_OPTIONS),
  displayShareModule: z.boolean(),
  displayFilterBar: z.boolean(),
  filterBarOptions: z.array(z.enum(WIDGET_CONFIG_FILTER_BAR_OPTIONS)),
});

export type WidgetConfig = z.infer<typeof WidgetConfigZodSchema> & Document<Types.ObjectId>;

const WidgetConfigMongooseSchema = zodSchema(WidgetConfigZodSchema);
WidgetConfigMongooseSchema.path("publicId").unique(true);
WidgetConfigMongooseSchema.set("collection", "widget_config");
WidgetConfigMongooseSchema.set("timestamps", true);

WidgetConfigMongooseSchema.path("pageSize").validate(
  isAllowedPageSize,
  "pageSize must be one of the allowed page sizes",
);

const allowedFilterValues: Record<string, readonly string[]> = {
  "filters.contentTypes": Object.values(ContentType),
  "filters.publics": PUBLIC_TYPES,
  "filters.statuses": PUBLIC_STATUS_TYPES,
  "filters.frenchLevels": SEARCH_FRENCH_LEVEL_OPTIONS,
  "filters.ages": SEARCH_AGE_OPTIONS,
  "filters.languages": I18nCodeZodSchema.options,
};

for (const [path, allowedValues] of Object.entries(allowedFilterValues)) {
  WidgetConfigMongooseSchema.path(path).validate(
    (values: string[]) => values.every((value) => allowedValues.includes(value)),
    `${path} contains an unknown value`,
  );
}

export const WidgetConfigModel = (models.WidgetConfig ||
  model("WidgetConfig", WidgetConfigMongooseSchema)) as Model<WidgetConfig>;
