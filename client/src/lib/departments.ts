import { departments } from "data/departments"

export const getDbDepartment = (depName: string) => {
  const index = departments.map(dep => dep.split(" - ")[1]).indexOf(depName);
  return index > -1 ? departments[index] : depName;
}

export const formatDepartment = (depName: string) => {
  let depDbFormat = depName;

  if (!depDbFormat.includes(" - ")) {
    depDbFormat = getDbDepartment(depName);
  }

  const dep = depDbFormat.split(" - ");
  return `${dep[1]} (${dep[0]})`;
}
