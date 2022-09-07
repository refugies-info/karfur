import { Theme } from "types/interface";

export const getThemeName = (
  theme: Theme | undefined,
  routerLocale: string | undefined,
  property: "name" | "short" = "name"
) => {
  if (!theme) return ""
  const locale = routerLocale || "fr";
  return theme[property][locale] || theme[property].fr;
}
