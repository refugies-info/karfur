import { GetNeedResponse, GetThemeResponse, Id } from "@refugies-info/api-types";

export const getInitialTheme = (
  allNeeds: GetNeedResponse[],
  themes: GetThemeResponse[],
  needsSelected: Id[],
  themesSelected: Id[],
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
