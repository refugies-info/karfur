import logger from "../../../logger";
import { getActiveContents } from "../../../modules/dispositif/dispositif.repository";
import { getTraductionsByLanguage } from "../../../modules/traductions/traductions.repository";
import { Languages, Traductions, TraductionsStatus } from "../../../typegoose";

export interface GetDispositifsWithTranslationAvancementResponse {
  _id: string;
  titreInformatif: string;
  titreMarque: string;
  nbMots: number;
  created_at: Date;
  typeContenu: "dispositif" | "demarche";
  lastTradUpdatedAt: number;
  avancementTrad: number;
  avancementValidation: number;
  tradStatus: TraductionsStatus;
}

const getTradStatus = (tradArray: Traductions[]): TraductionsStatus => {
  const isPublished = !!tradArray.find((trad) => trad.status === TraductionsStatus.VALIDATED);
  if (isPublished) return TraductionsStatus.VALIDATED;

  const isARevoir = !!tradArray.find((trad) => trad.status === TraductionsStatus.TO_REVIEW);
  if (isARevoir) return TraductionsStatus.TO_REVIEW;

  const isEnAttente = !!tradArray.find((trad) => trad.status === TraductionsStatus.PENDING);
  if (isEnAttente) return TraductionsStatus.PENDING;

  return TraductionsStatus.TO_TRANSLATE;
};

export const getDispositifsWithTranslationAvancement = async (locale: Languages) => {
  logger.info("[getDispositifsWithTranslationAvancement] received with locale", { locale });

  const activeDispositifs = await getActiveContents({
    created_at: 1,
    nbMots: 1,
    translations: 1,
    typeContenu: 1,
  });

  const traductions = await getTraductionsByLanguage(locale, {
    avancement: 1,
    dispositifId: 1,
    translated: 1,
    updatedAt: 1,
    userId: 1,
    type: 1,
  });

  let results: GetDispositifsWithTranslationAvancementResponse[] = [];

  activeDispositifs.forEach((dispositif) => {
    const correspondingTrads = traductions.filter(
      (trad) => trad.dispositifId && dispositif._id && trad.dispositifId === dispositif._id,
    );
    const dispositifData = {
      _id: dispositif._id.toString(),
      titreInformatif: dispositif.translations.fr.content.titreInformatif,
      titreMarque: dispositif.translations.fr.content.titreMarque,
      nbMots: dispositif.nbMots,
      created_at: dispositif.created_at,
      typeContenu: dispositif.typeContenu,
    };

    if (correspondingTrads.length === 0) {
      return results.push({
        ...dispositifData,
        lastTradUpdatedAt: null,
        avancementTrad: 0,
        avancementValidation: 0,
        tradStatus: TraductionsStatus.TO_TRANSLATE,
      });
    }
    const lastTradUpdatedAt = Math.max(0, ...correspondingTrads.map((z) => z.updatedAt.getTime() || 0));
    const avancementTrad = Math.max(0, ...correspondingTrads.map((z) => z.avancement || -1));

    const avancementValidation = Math.max(
      0,
      ...correspondingTrads
        .filter((y) => {
          return y.type === "validation";
        })
        .map((z) => z.avancement || -1),
    );

    const tradStatus = getTradStatus(correspondingTrads);

    return results.push({
      ...dispositifData,
      lastTradUpdatedAt,
      avancementTrad,
      avancementValidation,
      tradStatus,
    });
  });

  logger.info("[getDispositifsWithTranslationAvancement] got results", { count: results.length });
  return results;
};
