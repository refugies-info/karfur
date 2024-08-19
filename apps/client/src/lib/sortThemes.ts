import { GetThemeResponse } from "@refugies-info/api-types";

export const sortThemes = (a: GetThemeResponse, b: GetThemeResponse) => (a.position > b.position ? 1 : -1)
