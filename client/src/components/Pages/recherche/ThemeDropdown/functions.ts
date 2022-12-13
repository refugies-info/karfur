import { ObjectId } from "mongodb";
import { Need, Theme } from "types/interface";

export const getInitialTheme = (
  allNeeds: Need[],
  themes: Theme[],
  needsSelected: ObjectId[],
  themesSelected: ObjectId[],
  isMobile: boolean
) => {
  if (isMobile) return null;
  const allThemeIds = [...themesSelected];
  for (const needId of needsSelected) {
    const themeId = allNeeds.find((n) => n._id === needId)?.theme._id;
    if (themeId) allThemeIds.push(themeId);
  }
  if (allThemeIds.length > 0) return allThemeIds[0];
  return themes[0]?._id || null;
};
