import { GetNeedResponse, GetThemeResponse, Id } from "@refugies-info/api-types";

/**
 * Get themes from selected needs
 * @param needsSelected - list of need ids
 * @param allNeeds - all needs
 * @returns - themes and needs
 */
export const getThemesFromNeeds = (needsSelected: Id[], allNeeds: GetNeedResponse[]): { themes: Id[]; needs: Id[] } => {
  const needs = needsSelected.map((need) => allNeeds.find((n) => n._id === need)).filter((n) => !!n) as GetNeedResponse[];

  // get all themes displayed
  const themesDisplayed: GetThemeResponse[] = [];
  for (const need of needs) {
    if (need.theme && !themesDisplayed.find((t) => t._id === need.theme._id)) {
      themesDisplayed.push({ ...need.theme, active: true });
    }
  }

  // for each theme displayed, if all needs selected, set theme selected
  const themesSelected: Id[] = [];
  for (const themeDisplayed of themesDisplayed) {
    const totalNeedsOfTheme = allNeeds.filter((n) => n.theme._id === themeDisplayed._id).length;
    const countNeedsOfThemeSelected = needs.filter((n) => n.theme._id === themeDisplayed._id).length;
    if (totalNeedsOfTheme === countNeedsOfThemeSelected) {
      themesSelected.push(themeDisplayed._id);
    }
  }

  return {
    themes: themesSelected,
    needs: needs.filter((n) => !themesSelected.includes(n.theme._id)).map((n) => n._id)
  };
};

/**
 * Get needs from selected themes
 * @param themesSelected - list of theme ids
 * @param allNeeds - all needs
 * @returns - need ids
 */
export const getNeedsFromThemes = (themesSelected: Id[], allNeeds: GetNeedResponse[]): Id[] => {
  return allNeeds
    .filter(need => themesSelected.includes(need.theme._id))
    .map(n => n._id);
};
