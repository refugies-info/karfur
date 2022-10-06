import { ObjectId } from "mongodb";
import { Need, Theme } from "types/interface";

/**
 * Get themes from selected needs
 * @param needsSelected - list of need ids
 * @param allNeeds - all needs
 * @returns - themes and needs
 */
export const getThemesFromNeeds = (needsSelected: ObjectId[], allNeeds: Need[]): { themes: ObjectId[]; needs: ObjectId[] } => {
  const needs = needsSelected.map((need) => allNeeds.find((n) => n._id === need)).filter((n) => !!n) as Need[];

  // get all themes displayed
  const themesDisplayed: Theme[] = [];
  for (const need of needs) {
    if (need.theme && !themesDisplayed.find((t) => t._id === need.theme._id)) {
      themesDisplayed.push(need.theme);
    }
  }

  // for each theme displayed, if all needs selected, set theme selected
  const themesSelected: ObjectId[] = [];
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
