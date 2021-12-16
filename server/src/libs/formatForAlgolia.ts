import { AlgoliaObject } from "../types/interface";
import { LangueDoc } from "../schema/schemaLangue";

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

const getAllNeedTitles = (need: any, activeLanguages: LangueDoc[]) => {
  const titles: any = {};
  for (const ln of activeLanguages) {
    if (need[ln.i18nCode]) {
      titles["title_" + ln.i18nCode] = need[ln.i18nCode].text;
    }
  }
  return titles;
}

export const formatForAlgolia = (
  content: any,
  activeLanguages: LangueDoc[]|null = null
): AlgoliaObject => {

  if (content.typeContenu === "dispositif" || content.typeContenu === "demarche") {
    const tags = content.tags.map((t: any) => t ? t.name : null).filter((t: any) => t !== null);
    return {
      objectID: content._id,
      ...extractValuesPerLanguage(content.titreInformatif, "title"),
      ...extractValuesPerLanguage(content.titreMarque, "titreMarque"),
      ...extractValuesPerLanguage(content.abstract, "abstract"),
      tags: tags,
      needs: content.needs,
      nbVues: content.nbVues,
      typeContenu: content.typeContenu,
      sponsorUrl: content?.mainSponsor?.picture?.secure_url,
      sponsorName: content?.mainSponsor?.nom,
      priority: content.typeContenu === "dispositif" ? 30 : 40,
    };

  } else if (!content.typeContenu) { // no typeContenu => besoin
    return {
      objectID: content._id,
      ...getAllNeedTitles(content, activeLanguages),
      tagName: content.tagName,
      typeContenu: "besoin",
      priority: 20,
    }
  }
}
