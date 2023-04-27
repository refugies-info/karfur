import { get } from "lodash";

import { AlgoliaObject } from "../types/interface";
import { Dispositif, Langue, Need, Theme } from "../typegoose";

const extractValuesPerLanguage = (translations: Dispositif["translations"], path: string, keyPrefix: string) => {
  if (!translations) return {};
  const normalizedObject: any = {};
  for (const [ln, translation] of Object.entries(translations)) {
    const value = get(translation, path);
    normalizedObject[`${keyPrefix}_${ln}`] = value;
  }
  return normalizedObject;
};

const getAllNeedTitles = (need: Need, activeLanguages: Langue[]) => {
  const titles: any = {};
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

export const formatForAlgolia = (
  content: Dispositif | Need | Theme,
  activeLanguages: Langue[] | null = null,
  type: "dispositif" | "need" | "theme",
): AlgoliaObject => {
  if (type === "dispositif") {
    const dispositif = content as Dispositif;
    const mainSponsor = dispositif.getMainSponsor();
    return {
      objectID: dispositif._id,
      ...extractValuesPerLanguage(dispositif.translations, "content.titreInformatif", "title"),
      ...extractValuesPerLanguage(dispositif.translations, "content.titreMarque", "titreMarque"),
      ...extractValuesPerLanguage(dispositif.translations, "content.abstract", "abstract"),
      theme: dispositif.theme || "",
      secondaryThemes: dispositif.secondaryThemes || [],
      needs: dispositif.needs,
      nbVues: dispositif.nbVues,
      typeContenu: dispositif.typeContenu,
      sponsorUrl: mainSponsor?.picture?.secure_url,
      sponsorName: mainSponsor?.nom,
      priority: dispositif.typeContenu === "dispositif" ? 30 : 40,
      webOnly: dispositif.webOnly || false,
    };
  } else if (type === "need") {
    const need = content as Need;
    return {
      objectID: need._id,
      ...getAllNeedTitles(need, activeLanguages),
      theme: need.theme,
      typeContenu: "besoin",
      priority: 20,
      webOnly: false,
    };
  }

  const theme = content as Theme;
  return {
    objectID: theme._id,
    title_fr: theme.short.fr, // only for typescript validation
    ...getAllThemeTitles(theme, activeLanguages, "name"),
    ...getAllThemeTitles(theme, activeLanguages, "short"),
    typeContenu: "theme",
    priority: 10,
    webOnly: false,
  };
};
