import { LOCATION_FRANCE, LOCATION_ONLINE } from "~/data/learnFrench";
import { normalizeString } from "~/lib/string";

const DEPARTMENT_SEPARATOR = " - ";

const getDepartmentName = (location: string): string =>
  location.split(DEPARTMENT_SEPARATOR)[1] ?? location;

const matchesSearchedDepartment = (location: string, searchedDepartments: string[]): boolean =>
  searchedDepartments.some(
    (department) =>
      normalizeString(location) === normalizeString(department) ||
      normalizeString(getDepartmentName(location)) === normalizeString(department),
  );

export const getDepartmentBadge = (
  location: string | string[] | null | undefined,
  searchedDepartments: string[],
): string | null => {
  const locations = Array.isArray(location) ? location : location ? [location] : [];
  const displayed =
    locations.find((value) => matchesSearchedDepartment(value, searchedDepartments)) ??
    locations[0];
  if (!displayed || displayed === LOCATION_FRANCE || displayed === LOCATION_ONLINE) return null;
  return getDepartmentName(displayed);
};
