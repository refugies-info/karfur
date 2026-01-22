import type { Picture } from "@refugies-info/api-types";
import { DispositifOrigin } from "@refugies-info/api-types";

export interface ContentSource {
  origin: DispositifOrigin;
  logo: Picture;
  textKey: string; // Clé de traduction dans i18n
}

export const contentSources: ContentSource[] = [
  {
    origin: DispositifOrigin.RCO,
    logo: {
      imgId: null,
      public_id: "carif-oref-logo",
      secure_url: "/images/sources/carif-oref-logo.png",
    },
    textKey: "ContentSources.RCO.description",
  },
];

/**
 * Helper pour récupérer une source par son origin
 */
export const getContentSourceByOrigin = (origin: DispositifOrigin): ContentSource | undefined => {
  return contentSources.find((source) => source.origin === origin);
};
