import { Metadatas } from "@refugies-info/api-types";
import { TFunction } from "next-i18next";

export const getDepartments = (location: Metadatas["location"], t: TFunction) => {
  if (!location || !Array.isArray(location)) return "";
  const nbDepartments = location.length;
  if (nbDepartments === 0) return "";
  if (nbDepartments === 1) return `(${location[0]})`;
  return t("Dispositif.inDepartments", { count: nbDepartments });
}
