import { ObjectId } from "mongoose";
import { AlgoliaObject } from "../types/interface";
import { LangueDoc } from "../schema/schemaLangue";
import { DispositifDoc } from "../schema/schemaDispositif";
import { NeedDoc } from "../schema/schemaNeeds";
import { ThemeDoc } from "../schema/schemaTheme";
import { StructureDoc } from "../schema/schemaStructure";

const extractValuesPerLanguage = (object: any, keyPrefix: string) => {
  if (!object) return {};
  if (typeof object !== "object") { // if object is string
    return { [`${keyPrefix}_fr`]: object }
  }
  const normalizedObject: any = {};
  for (const [ln, value] of Object.entries(object)) {
    normalizedObject[`${keyPrefix}_${ln}`] = value;
  }
  return normalizedObject;
}

type Dispositif = DispositifDoc & {
  _id: ObjectId
  theme: ThemeDoc
  secondaryThemes: ThemeDoc[]
  mainSponsor: StructureDoc
};
type Need = NeedDoc & { _id: ObjectId } & { theme: ThemeDoc }
type Theme = ThemeDoc & { _id: ObjectId };

const getAllNeedTitles = (need: any, activeLanguages: LangueDoc[]) => {
  const titles: any = {};
  for (const ln of activeLanguages) {
    if (need[ln.i18nCode]) {
      titles["title_" + ln.i18nCode] = need[ln.i18nCode].text;
    }
  }
  return titles;
}

const getAllThemeTitles = (theme: Theme, activeLanguages: LangueDoc[], property: "name" | "short") => {
  const titles: Record<string, string> = {};
  for (const ln of activeLanguages) {
    if (theme[property][ln.i18nCode]) {
      const prefix = property === "name" ? "name" : "title";
      titles[prefix + "_" + ln.i18nCode] = theme[property][ln.i18nCode];
    }
  }
  return titles;
}

export const formatForAlgolia = (
  content: Dispositif | Need | Theme,
  activeLanguages: LangueDoc[] | null = null,
  type: "dispositif" | "need" | "theme"
): AlgoliaObject => {

  if (type === "dispositif") {
    const dispositif = content as Dispositif;
    return {
      objectID: dispositif._id,
      ...extractValuesPerLanguage(dispositif.titreInformatif, "title"),
      ...extractValuesPerLanguage(dispositif.titreMarque, "titreMarque"),
      ...extractValuesPerLanguage(dispositif.abstract, "abstract"),
      theme: dispositif.theme?._id || "",
      //@ts-ignore
      secondaryThemes: (dispositif.secondaryThemes || []).map(t => t._id),
      needs: dispositif.needs,
      nbVues: dispositif.nbVues,
      typeContenu: dispositif.typeContenu,
      sponsorUrl: dispositif?.mainSponsor?.picture?.secure_url,
      sponsorName: dispositif?.mainSponsor?.nom,
      priority: dispositif.typeContenu === "dispositif" ? 30 : 40,
      webOnly: dispositif.webOnly || false
    };

  } else if (type === "need") {
    const need = content as Need;
    return {
      objectID: need._id,
      ...getAllNeedTitles(need, activeLanguages),
      theme: need.theme._id,
      typeContenu: "besoin",
      priority: 20,
    }
  }

  const theme = content as Theme;
  return {
    objectID: theme._id,
    title_fr: theme.short.fr, // only for typescript validation
    ...getAllThemeTitles(theme, activeLanguages, "name"),
    ...getAllThemeTitles(theme, activeLanguages, "short"),
    typeContenu: "theme",
    priority: 10,
  }
}
