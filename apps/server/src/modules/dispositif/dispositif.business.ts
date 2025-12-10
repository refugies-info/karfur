import { ContentType, type Languages } from "@refugies-info/api-types";
import { isDocument, isDocumentArray } from "@typegoose/typegoose";
import { get, has } from "lodash";
import { MustBePopulatedError } from "~/errors";
import type { Dispositif } from "~/typegoose/Dispositif";
import type { Need } from "~/typegoose/Need";
import type { Structure } from "~/typegoose/Structure";
import type { Theme } from "~/typegoose/Theme";
import type { User } from "~/typegoose/User";

export const getDispositifMainSponsor = (dispositif: Dispositif): Structure => {
  if (!dispositif.mainSponsor || !isDocument(dispositif.mainSponsor as any)) {
    throw new MustBePopulatedError("mainSponsor");
  }

  return dispositif.mainSponsor as Structure;
};

export const getDispositifDepartements = (dispositif: Dispositif) => {
  return dispositif.metadatas?.location || null;
};

export const getDispositifTheme = (dispositif: Dispositif): Theme | null => {
  if (!dispositif.theme) return null;
  if (!isDocument(dispositif.theme as any)) {
    throw new MustBePopulatedError("theme");
  }
  return dispositif.theme as Theme;
};

export const getDispositifSecondaryThemes = (dispositif: Dispositif): Theme[] => {
  if (!dispositif.secondaryThemes) return [];
  if (!isDocumentArray(dispositif.secondaryThemes as any)) {
    throw new MustBePopulatedError("secondaryThemes");
  }
  return dispositif.secondaryThemes as Theme[];
};

export const getDispositifNeeds = (dispositif: Dispositif): Need[] => {
  if (!dispositif.needs) return [];
  if (!isDocumentArray(dispositif.needs as any)) {
    throw new MustBePopulatedError("needs");
  }
  return dispositif.needs as Need[];
};

export const getDispositifCreator = (dispositif: Dispositif): User | null => {
  if (!dispositif.creatorId) return null;
  if (!isDocument(dispositif.creatorId as any)) {
    throw new MustBePopulatedError("creatorId");
  }
  return dispositif.creatorId as User;
};

export const isDispositif = (dispositif: Dispositif): boolean => {
  return dispositif.typeContenu === ContentType.DISPOSITIF;
};

export const isDemarche = (dispositif: Dispositif): boolean => {
  return dispositif.typeContenu === ContentType.DEMARCHE;
};

export const isDispositifTranslatedIn = (dispositif: Dispositif, ln: Languages) => {
  return has(dispositif.translations, ln);
};

/**
 * Cette fonction permet de récupérer un élément traduit depuis TranslationContent
 * dans la langue que vous voulez. Le path permet de cibler l'élément.
 *
 * @param path le chemin dans l'objet TranslationContent que vous voulez récupérer
 * @param ln la langue dans laquelle vous souhaitez récupérer la traduction
 * @param defaultLanguage le language dans lequel renvoyer la traduction si ln n'existe pas
 * @returns élément traduit
 *
 * @see TranslationContent
 */
export const getDispositifTranslated = (
  dispositif: Dispositif,
  path: string,
  ln: Languages | string = "fr",
  defaultLanguage: string = "fr",
) => {
  return isDispositifTranslatedIn(dispositif, ln as Languages)
    ? get(dispositif.translations, `${ln}.${path}`)
    : get(dispositif.translations, `${defaultLanguage}.${path}`);
};
