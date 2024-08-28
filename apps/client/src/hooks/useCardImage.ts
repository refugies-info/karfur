import { ContentType, GetThemeResponse } from "@refugies-info/api-types";

const imageNameMap: Record<string, string> = {
  // Faire mes papiers
  "63286a015d31b2c0cad9960b": "administratif",
  // Apprendre le français
  "63286a015d31b2c0cad9960a": "français",
  // Trouver un logement
  "63286a015d31b2c0cad9960c": "logement",
  // Santé
  "63286a015d31b2c0cad9960f": "santé",
  // Apprendre un métier
  "63286a015d31b2c0cad99610": "formation",
  // Trouver un travail
  "63286a015d31b2c0cad9960e": "travail",
  // Transports
  "63286a015d31b2c0cad9960d": "mobilité",
  // Famille
  "63450dd43e23cd7181ba0b26": "famille",
  // Faire des études
  "63286a015d31b2c0cad99611": "études",
  // Activités et culture
  "63286a015d31b2c0cad99615": "loisirs",
};

export const useCardImageUrl = (theme: GetThemeResponse | undefined | null, contentType: ContentType) => {
  const themeId = theme?._id?.toString();
  const imageName = themeId && Object.keys(imageNameMap).includes(themeId) ? imageNameMap[themeId] : "administratif";
  return `/images/cards/${contentType}/${imageName}.svg`;
};
