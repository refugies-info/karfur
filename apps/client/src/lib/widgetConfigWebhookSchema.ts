import {
  ContentType,
  LANGUAGE_CODES,
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
  type WidgetConfigPageSize,
} from "@refugies-info/api-types";
import { z } from "zod";
import { departments } from "../data/departments";
import { BaseWebhookSchema, ObjectIdSchema } from "./webhookSchemas";

const MAX_AUTHORIZED_DOMAINS = 20;

const HOSTNAME_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;

// The search matches the department name ("Gironde"), not its code
const DEPARTMENT_NAMES = departments.map((department) =>
  department.slice(department.indexOf(" - ") + 3),
);

const DepartmentNameSchema = z.string().refine((value) => DEPARTMENT_NAMES.includes(value), {
  message: "Département invalide : utiliser le nom (ex: Gironde), pas le code",
});

// Same keys and value formats as the search query parameters
export const WidgetConfigFiltersSchema = z
  .object({
    contentTypes: z.array(z.nativeEnum(ContentType)),
    departments: z.array(DepartmentNameSchema),
    themes: z.array(ObjectIdSchema),
    needs: z.array(ObjectIdSchema),
    publics: z.array(z.enum(PUBLIC_TYPES)),
    statuses: z.array(z.enum(PUBLIC_STATUS_TYPES)),
    frenchLevels: z.array(z.enum(SEARCH_FRENCH_LEVEL_OPTIONS)),
    ages: z.array(z.enum(SEARCH_AGE_OPTIONS)),
    languages: z.array(z.enum(LANGUAGE_CODES)),
  })
  .partial()
  .strict();

export type WidgetConfigFiltersInput = z.infer<typeof WidgetConfigFiltersSchema>;

const widgetConfigShape = {
  internalTitle: z.string().trim().min(1).max(150),
  type: z.enum(WIDGET_CONFIG_TYPES),
  structureName: z.string().trim().min(1).max(150),
  authorizedDomains: z
    .array(
      z.string().trim().toLowerCase().regex(HOSTNAME_REGEX, {
        message: "Domaine invalide (nom d'hôte sans protocole ni chemin, ex: exemple.org)",
      }),
    )
    .max(MAX_AUTHORIZED_DOMAINS),
  externalTitle: z.string().trim().min(1).max(100),
  description: z.string().trim().max(300),
  displayDescription: z.boolean(),
  filters: WidgetConfigFiltersSchema,
  selectedDispositifIds: z.array(ObjectIdSchema).max(WIDGET_CONFIG_MAX_MANUAL_DISPOSITIFS),
  excludedDispositifIds: z.array(ObjectIdSchema).max(WIDGET_CONFIG_MAX_MANUAL_DISPOSITIFS),
  pageSize: z
    .number()
    .refine((value) => WIDGET_CONFIG_PAGE_SIZES.includes(value as WidgetConfigPageSize), {
      message: `Taille de page invalide. Valeurs autorisées : ${WIDGET_CONFIG_PAGE_SIZES.join(", ")}`,
    }),
  sortBy: z.enum(WIDGET_CONFIG_SORT_OPTIONS),
  displayShareModule: z.boolean(),
  displayFilterBar: z.boolean(),
  filterBarOptions: z.array(z.enum(WIDGET_CONFIG_FILTER_BAR_OPTIONS)),
  status: z.enum(WIDGET_CONFIG_STATUSES),
};

export const hasSelectedAndExcludedOverlap = (
  selectedDispositifIds: string[] = [],
  excludedDispositifIds: string[] = [],
) => selectedDispositifIds.some((id) => excludedDispositifIds.includes(id));

const hasNoOverlap = (config: {
  selectedDispositifIds?: string[];
  excludedDispositifIds?: string[];
}) => !hasSelectedAndExcludedOverlap(config.selectedDispositifIds, config.excludedDispositifIds);

const overlapIssue = {
  message: "Une fiche ne peut pas être à la fois ajoutée manuellement et exclue",
  path: ["excludedDispositifIds"],
};

export const WidgetConfigCreateSchema = BaseWebhookSchema.extend({
  widgetConfig: z
    .object(widgetConfigShape)
    .partial({ description: true })
    .strict()
    .refine(hasNoOverlap, overlapIssue),
});

export const WidgetConfigUpdateSchema = BaseWebhookSchema.extend({
  widgetConfig: z
    .object(widgetConfigShape)
    .partial()
    .extend({ _id: ObjectIdSchema })
    .strict()
    .refine(hasNoOverlap, overlapIssue),
});

export const WidgetConfigPreviewSchema = z.object({ filters: WidgetConfigFiltersSchema }).strict();
