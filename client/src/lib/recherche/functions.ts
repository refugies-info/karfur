import { GetDispositifsResponse, GetNeedResponse, GetThemeResponse, Id } from "api-types";

/**
 * Get themes to display based on query filters
 * @param allThemes - GetThemeResponse[]
 * @param allNeeds - GetNeedResponse[]
 * @param selectedThemes - Id[]
 * @param selectedNeeds - Id[]
 * @returns GetThemeResponse[]
 */
export const getThemesDisplayed = (
  allThemes: GetThemeResponse[],
  allNeeds: GetNeedResponse[],
  selectedThemes: Id[],
  selectedNeeds: Id[]
) => {
  const needs = selectedNeeds.map((need) => allNeeds.find((n) => n._id === need)).filter((n) => !!n) as GetNeedResponse[];

  // get all themes displayed
  const newThemesDisplayed: GetThemeResponse[] = [];
  for (const theme of selectedThemes) {
    const themeToAdd = allThemes.find((t) => t._id === theme);
    if (themeToAdd) newThemesDisplayed.push(themeToAdd);
  }
  for (const need of needs) {
    if (need.theme && !newThemesDisplayed.find((t) => t._id === need.theme._id)) {
      newThemesDisplayed.push({ ...need.theme, active: true });
    }
  }
  return newThemesDisplayed;
};

/**
 * Return the number of dispositifs for a department
 * @param department - string
 * @param dispositifs - list of dispositifs
 * @returns number
 */
const getCountDispositifsForDepartment = (
  department: string,
  dispositifs: GetDispositifsResponse[],
): number => {
  return [...dispositifs]
    .filter(dispositif => {
      const location = dispositif.metadatas.location;
      if (!location) return false;
      return location.map(dep => dep.split(" - ")[1]).includes(department)
    }).length
}

/**
 * Get departements considered as not deployed yet
 * @param departments - list of departments
 * @param dispositifs - dispositifs to filter
 * @returns - list of not deployed departements
 */
export const getDepartmentsNotDeployed = (departments: string[], dispositifs: GetDispositifsResponse[]) => {
  const newDepartmentsNotDeployed: string[] = [];
  for (const dep of departments) {
    const count = getCountDispositifsForDepartment(dep, dispositifs);
    if (count < 10) {
      newDepartmentsNotDeployed.push(dep);
    }
  }
  return newDepartmentsNotDeployed;
}
