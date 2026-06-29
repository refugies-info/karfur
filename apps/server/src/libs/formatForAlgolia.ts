import type { Dispositif, Langue, Need, NeedId, Theme, ThemeId } from "@refugies-info/mongo";
import { get } from "lodash";
import { mapToPlainObject } from "~/libs/mongooseMaps";
import { getDispositifMainSponsor } from "~/modules/dispositif/dispositif.business";
import type { AlgoliaObject } from "~/types/interface";

const extractValuesPerLanguage = (translations: any, path: string, keyPrefix: string) => {
  if (!translations) return {};
  const normalizedObject: Record<string, string> = {};

  // Use centralized utility to handle both Map and plain object
  const plainTranslations = mapToPlainObject(translations);
  for (const [ln, translation] of Object.entries(plainTranslations)) {
    const value = get(translation, path);
    normalizedObject[`${keyPrefix}_${ln}`] = value;
  }
  return normalizedObject;
};

const getAllNeedTitles = (need: Need, activeLanguages: Langue[]) => {
  const titles: Record<string, string> = {};
  for (const ln of activeLanguages) {
    if (need[ln.i18nCode]) {
      titles["title_" + ln.i18nCode] = need[ln.i18nCode].text;
    }
  }
  return titles;
};

const getAllThemeTitles = (theme: Theme, activeLanguages: Langue[], property: "name" | "short") => {
  const titles: Record<string, string> = {};
  for (const ln of activeLanguages) {
    if (theme[property][ln.i18nCode]) {
      const prefix = property === "name" ? "name" : "title";
      titles[prefix + "_" + ln.i18nCode] = theme[property][ln.i18nCode];
    }
  }
  return titles;
};

const getLocation = (dispositif: Dispositif): AlgoliaObject["location"] => {
  const location = dispositif.metadatas?.location;
  if (Array.isArray(location)) {
    return "0_localized";
  }
  if (location === "france") return "1_france";
  if (location === "online") return "2_online";
  return undefined;
};

export const isAlgoliaObject = (obj: unknown): obj is AlgoliaObject => {
  if (!obj || typeof obj !== "object") return false;

  const requiredProps: (keyof AlgoliaObject)[] = [
    "objectID",
    "title_fr",
    "typeContenu",
    "priority",
    "webOnly",
  ];

  return requiredProps.every((prop) => prop in obj);
};

export const formatForAlgolia = (
  content: Dispositif | Need | Theme,
  activeLanguages: Langue[] | null = null,
  type: "dispositif" | "need" | "theme",
): AlgoliaObject | undefined => {
  let value;

  if (type === "dispositif") {
    const dispositif = content as Dispositif;
    const mainSponsor = dispositif.mainSponsor ? getDispositifMainSponsor(dispositif) : null;
    const location = getLocation(dispositif);

    value = {
      objectID: dispositif._id,
      ...extractValuesPerLanguage(dispositif.translations, "content.titreInformatif", "title"),
      ...extractValuesPerLanguage(dispositif.translations, "content.titreMarque", "titreMarque"),
      ...extractValuesPerLanguage(dispositif.translations, "content.abstract", "abstract"),
      theme: {
        _id: (dispositif.theme as unknown as Theme)?._id || dispositif.theme || "",
      } as ThemeId, // TODO: revert to keeping only id (change on mobile app too)
      secondaryThemes: (dispositif.secondaryThemes || []).map((t) => ({
        _id: (t as unknown as Theme)?._id || t,
      })) as ThemeId[], // TODO: revert to keeping only id (change on mobile app too)
      needs: dispositif.needs as NeedId[],
      nbVues: dispositif.nbVues,
      typeContenu: dispositif.typeContenu,
      sponsorUrl: mainSponsor?.picture?.secure_url || "",
      sponsorName: mainSponsor?.nom,
      priority: dispositif.typeContenu === "dispositif" ? 30 : 40,
      webOnly: dispositif.webOnly || false,
      location,
      origin: dispositif.origin ?? "RI",
    };
  } else if (type === "need") {
    const need = content as Need;
    value = {
      objectID: need._id,
      ...getAllNeedTitles(need, activeLanguages),
      theme: { _id: (need.theme as unknown as Theme)?._id || need.theme || "" } as ThemeId, // TODO: revert to keeping only id (change on mobile app too)
      typeContenu: "besoin",
      priority: 20,
      webOnly: false,
    };
  } else if (type === "theme") {
    const theme = content as Theme;
    value = {
      objectID: theme._id,
      title_fr: theme.short.fr, // only for typescript validation
      ...getAllThemeTitles(theme, activeLanguages, "name"),
      ...getAllThemeTitles(theme, activeLanguages, "short"),
      typeContenu: "theme",
      priority: 10,
      webOnly: false,
    };
  }

  return isAlgoliaObject(value) ? value : undefined;
};
