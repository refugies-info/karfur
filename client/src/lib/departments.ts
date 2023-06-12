import { departments } from "data/departments"

export const getDbDepartment = (depName: string) => {
  const index = departments.map(dep => dep.split(" - ")[1]).indexOf(depName);
  return index > -1 ? departments[index] : depName;
}

/**
 * Get department name or postal code from GMap autocomplete
 * @returns a department number or name formatted
 */
export const formatDepartment = (depName: string) => {
  let depDbFormat = depName;

  // postal code
  if (depName.match(/\d{5}/g)) return depName.slice(0, 2);

  // department
  if (!depDbFormat.includes(" - ")) {
    depDbFormat = getDbDepartment(depName);
  }

  const dep = depDbFormat.split(" - ");
  if (!dep[1]) return dep[0];
  return `${dep[1]} (${dep[0]})`;
}
