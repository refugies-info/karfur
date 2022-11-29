import { getDispositifInfos } from "lib/getDispositifInfos";
import { ObjectId } from "mongodb";
import { Need, SearchDispositif, Theme } from "types/interface";

/**
 * Get themes to display based on query filters
 * @param allThemes - Theme[]
 * @param allNeeds - Need[]
 * @param selectedThemes - ObjectId[]
 * @param selectedNeeds - ObjectId[]
 * @returns Theme[]
 */
export const getThemesDisplayed = (
  allThemes: Theme[],
  allNeeds: Need[],
  selectedThemes: ObjectId[],
  selectedNeeds: ObjectId[]
) => {
  const needs = selectedNeeds.map((need) => allNeeds.find((n) => n._id === need)).filter((n) => !!n) as Need[];

  // get all themes displayed
  const newThemesDisplayed: Theme[] = [];
  for (const theme of selectedThemes) {
    const themeToAdd = allThemes.find((t) => t._id === theme);
    if (themeToAdd) newThemesDisplayed.push(themeToAdd);
  }
  for (const need of needs) {
    if (need.theme && !newThemesDisplayed.find((t) => t._id === need.theme._id)) {
      newThemesDisplayed.push(need.theme);
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
  dispositifs: SearchDispositif[],
): number => {
  return [...dispositifs]
    .filter(dispositif => {
      const location = getDispositifInfos(dispositif, "location");
      if (!location?.departments) return false;
      return location.departments.map(dep => dep.split(" - ")[1]).includes(department)
    }).length
}

/**
 * Get departements considered as not deployed yet
 * @param departments - list of departments
 * @param dispositifs - dispositifs to filter
 * @returns - list of not deployed departements
 */
export const getDepartmentsNotDeployed = (departments: string[], dispositifs: SearchDispositif[]) => {
  const newDepartmentsNotDeployed: string[] = [];
  for (const dep of departments) {
    const count = getCountDispositifsForDepartment(dep, dispositifs);
    if (count < 10) {
      newDepartmentsNotDeployed.push(dep);
    }
  }
  return newDepartmentsNotDeployed;
}
