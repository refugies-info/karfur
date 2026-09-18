import type { Picture } from "@refugies-info/api-types";
import { DispositifOrigin } from "@refugies-info/api-types";

interface ContentSourceDefinition {
  origin: DispositifOrigin;
  logo: Picture;
  textKey: string; // Clé de traduction dans i18n
  textKeyWithRegion?: string;
}

export const contentSources = [
  {
    origin: DispositifOrigin.RCO,
    logo: {
      imgId: null,
      public_id: "carif-oref-logo",
      secure_url: "/images/sources/carif-oref-logo.png",
    },
    textKey: "ContentSources.RCO.description",
    textKeyWithRegion: "ContentSources.RCO.descriptionWithRegion",
  },
] as const satisfies readonly ContentSourceDefinition[];

/**
 * Derived from the literals so that translation keys stay narrow enough for `t()`
 */
export type ContentSource = (typeof contentSources)[number];

/**
 * Helper pour récupérer une source par son origin
 */
export const getContentSourceByOrigin = (origin: DispositifOrigin): ContentSource | undefined => {
  return contentSources.find((source) => source.origin === origin);
};
