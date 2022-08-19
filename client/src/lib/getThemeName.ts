import { Theme } from "types/interface";

export const getThemeName = (
  theme: Theme,
  routerLocale: string | undefined,
  property: "name" | "short" = "name"
) => {
  const locale = routerLocale || "fr";
  return theme[property][locale] || theme[property].fr;
}
