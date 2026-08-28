import { ContentType, type Languages } from "@refugies-info/api-types";
import type { Dispositif, Need, Structure, Theme, User } from "@refugies-info/mongo";
import { isDocument, isDocumentArray } from "@refugies-info/mongo";
import { get, isEqual } from "lodash";
import { MustBePopulatedError } from "~/errors";
import { getMapKeys, getMapValue, hasMapKey } from "~/libs/mongooseMaps";

export const getDispositifMainSponsor = (dispositif: Dispositif): Structure => {
  if (!dispositif.mainSponsor || !isDocument(dispositif.mainSponsor as any)) {
    throw new MustBePopulatedError("mainSponsor");
  }

  return dispositif.mainSponsor as unknown as Structure;
};

export const getDispositifDepartements = (dispositif: Dispositif) => {
  return dispositif.metadatas?.location || null;
};

export const getDispositifTheme = (dispositif: Dispositif): Theme | null => {
  if (!dispositif.theme) return null;
  if (!isDocument(dispositif.theme as any)) {
    throw new MustBePopulatedError("theme");
  }
  return dispositif.theme as unknown as Theme;
};

export const getDispositifSecondaryThemes = (dispositif: Dispositif): Theme[] => {
  if (!dispositif.secondaryThemes) return [];
  if (!isDocumentArray(dispositif.secondaryThemes as any)) {
    throw new MustBePopulatedError("secondaryThemes");
  }
  return dispositif.secondaryThemes as unknown as Theme[];
};

export const getDispositifNeeds = (dispositif: Dispositif): Need[] => {
  if (!dispositif.needs) return [];
  if (!isDocumentArray(dispositif.needs as any)) {
    throw new MustBePopulatedError("needs");
  }
  return dispositif.needs as unknown as Need[];
};

export const getDispositifCreator = (dispositif: Dispositif): User | null => {
  if (!dispositif.creatorId) return null;
  if (!isDocument(dispositif.creatorId as any)) {
    throw new MustBePopulatedError("creatorId");
  }
  return dispositif.creatorId as unknown as User;
};

export const isDispositif = (dispositif: Dispositif): boolean => {
  return dispositif.typeContenu === ContentType.DISPOSITIF;
};

export const isDemarche = (dispositif: Dispositif): boolean => {
  return dispositif.typeContenu === ContentType.DEMARCHE;
};

export const isDispositifTranslatedIn = (dispositif: any, ln: Languages) => {
  if (!dispositif.translations) return false;
  return hasMapKey(dispositif.translations, ln);
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
export const getDispositifTranslation = (dispositif: any, ln: Languages, fallbackToFr = true) => {
  if (!dispositif.translations) return undefined;
  const hasLang = isDispositifTranslatedIn(dispositif, ln);
  const targetLang = hasLang ? ln : fallbackToFr ? "fr" : null;

  if (!targetLang) return undefined;

  // Use centralized utility to handle both Map and plain object
  return getMapValue(dispositif.translations, targetLang);
};

/**
 * Cette fonction permet de récupérer un élément traduit depuis TranslationContent
 * dans la langue que vous voulez. Le path permet de cibler l'élément.
 */
export const getDispositifTranslated = (
  dispositif: any,
  path: string,
  ln: Languages | string = "fr",
  defaultLanguage: string = "fr",
) => {
  const translation = getDispositifTranslation(dispositif, ln as Languages, false);
  if (translation) return get(translation, path);
  const fallback = getDispositifTranslation(dispositif, defaultLanguage as Languages, true);
  return get(fallback, path);
};

export const getAvailableLanguages = (dispositif: any): string[] => {
  if (!dispositif.translations) return [];
  // Use centralized utility to handle both Map and plain object
  return getMapKeys(dispositif.translations);
};

/** Libellés lisibles des metadatas, dans l'ordre du schéma */
const METADATAS_LABELS: Record<string, string> = {
  location: "Lieux",
  frenchLevel: "Niveau de français",
  age: "Âge",
  price: "Prix",
  publicStatus: "Statut du public",
  public: "Public visé",
  conditions: "Conditions",
  commitment: "Engagement",
  frequency: "Fréquence",
  timeSlots: "Créneaux horaires",
  sessions: "Sessions",
};

/** null et undefined sont équivalents, et on sort des subdocuments Mongoose */
const normalizeMetadata = (value: unknown) =>
  value === null || value === undefined ? null : JSON.parse(JSON.stringify(value));

/**
 * Compare 2 versions des metadatas d'une fiche et renvoie les libellés des
 * champs modifiés, pour pouvoir les citer dans une notification.
 */
export const getChangedMetadatasLabels = (
  oldMetadatas: Dispositif["metadatas"] | undefined,
  newMetadatas: Dispositif["metadatas"] | undefined,
): string[] => {
  const oldPlain = normalizeMetadata(oldMetadatas) || {};
  const newPlain = normalizeMetadata(newMetadatas) || {};
  const keys = [
    ...Object.keys(METADATAS_LABELS),
    // les clés inconnues du dictionnaire ne doivent pas passer inaperçues
    ...Object.keys({ ...oldPlain, ...newPlain }).filter((key) => !(key in METADATAS_LABELS)),
  ];

  return keys
    .filter((key) => !isEqual(normalizeMetadata(oldPlain[key]), normalizeMetadata(newPlain[key])))
    .map((key) => METADATAS_LABELS[key] || key);
};
