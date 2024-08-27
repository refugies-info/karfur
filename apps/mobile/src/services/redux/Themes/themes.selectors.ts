import { GetThemeResponse } from "@refugies-info/api-types";
import { RootState } from "../reducers";

export const themesSelector = (state: RootState): GetThemeResponse[] => state.themes;

export const themeSelector =
  (id: string | null | undefined) =>
  (state: RootState): GetThemeResponse | undefined =>
    themesSelector(state).find((theme) => theme._id.toString() === id);
