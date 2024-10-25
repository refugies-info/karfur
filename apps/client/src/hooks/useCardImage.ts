import { ContentType, GetThemeResponse } from "@refugies-info/api-types";

export const useCardImageUrl = (
  theme: GetThemeResponse | undefined | null,
  contentType: ContentType,
): string | null => {
  if (!theme) return null;
  const image =
    contentType === ContentType.DEMARCHE ? theme.demarcheImage?.secure_url : theme.dispositifImage?.secure_url;
  return image || null;
};
