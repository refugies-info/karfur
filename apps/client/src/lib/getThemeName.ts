import { GetThemeResponse } from "@refugies-info/api-types";

export const getThemeName = (
  theme: GetThemeResponse | undefined,
  routerLocale: string | undefined,
  property: "name" | "short" = "name"
) => {
  if (!theme) return ""
  const locale = routerLocale || "fr";
  return theme[property][locale] || theme[property].fr;
}
