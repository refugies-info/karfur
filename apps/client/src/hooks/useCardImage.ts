import { ContentType, GetThemeResponse } from "@refugies-info/api-types";

export const useCardImageUrl = (theme: GetThemeResponse | undefined | null, contentType: ContentType) => {
  const defaultImage = `/images/cards/${contentType}/administratif.svg`;
  if (!theme) return defaultImage;
  const image =
    contentType === ContentType.DEMARCHE ? theme.demarcheImage?.secure_url : theme.dispositifImage?.secure_url;
  return image || defaultImage;
};
