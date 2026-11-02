export const WIDGET_CONFIG_STATUSES = ["active", "inactive"] as const;
export type WidgetConfigStatus = (typeof WIDGET_CONFIG_STATUSES)[number];

export const WIDGET_CONFIG_TYPES = ["list", "thumbnail"] as const;

export const WIDGET_CONFIG_PAGE_SIZES = [4, 8, 12] as const;
export type WidgetConfigPageSize = (typeof WIDGET_CONFIG_PAGE_SIZES)[number];

export const WIDGET_CONFIG_SORT_OPTIONS = ["date", "views", "theme", "location"] as const;
export type WidgetConfigSortOption = (typeof WIDGET_CONFIG_SORT_OPTIONS)[number];

export const WIDGET_CONFIG_FILTER_BAR_OPTIONS = [
  "keyword",
  "location",
  "theme",
  "public",
  "status",
  "frenchLevel",
  "age",
  "language",
] as const;
export type WidgetConfigFilterBarOption = (typeof WIDGET_CONFIG_FILTER_BAR_OPTIONS)[number];

export const WIDGET_CONFIG_MAX_MANUAL_DISPOSITIFS = 100;
