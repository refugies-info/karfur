import { Metadatas } from "api-types/generics";

export const getDepartments = (location: Metadatas["location"]) => {
  if (!location || !Array.isArray(location)) return "";
  const nbDepartments = location.length;
  if (nbDepartments === 0) return "";
  if (nbDepartments === 1) return `(${location[0]})`;
  return `dans ${nbDepartments} départements`;
}
