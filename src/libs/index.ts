import { GetThemeResponse } from "@refugies-info/api-types";

export const firstLetterUpperCase = (string: string) =>
  string && string.length > 1
    ? string.charAt(0).toUpperCase() + string.slice(1, string.length)
    : "";

export const sortByOrder = (a: GetThemeResponse, b: GetThemeResponse) => {
  const orderA = a.position;
  const orderB = b.position;
  return orderA > orderB ? 1 : -1;
};

export { defaultColors } from "./getThemeTag";
