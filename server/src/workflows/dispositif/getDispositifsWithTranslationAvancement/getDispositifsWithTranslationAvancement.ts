import { GetDispositifsWithTranslationAvancementResponse, Languages, TraductionsStatus } from "api-types";
import { isEmpty, some } from "lodash";
import { TraductionsType } from "../../../typegoose/Traductions";
import logger from "../../../logger";
import { getActiveContents } from "../../../modules/dispositif/dispositif.repository";
import { getTraductionsByLanguage } from "../../../modules/traductions/traductions.repository";
import { Dispositif } from "../../../typegoose";

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
    toReview: 1,
  });

  let results: GetDispositifsWithTranslationAvancementResponse[] = [];

  activeDispositifs.forEach((dispositif: Dispositif) => {
    const correspondingTrads = traductions.filter((trad) => trad.dispositifId.toString() === dispositif._id.toString());

    const lastTradUpdatedAt = Math.max(
      0,
      dispositif.translations[locale]?.created_at.getTime() || 0,
      ...correspondingTrads.map((z) => z.updatedAt.getTime() || 0),
    );
    const avancementTrad = Math.max(0, ...correspondingTrads.map((z) => z.avancement || -1));
    const avancementValidation = Math.max(
      0,
      ...correspondingTrads
        .filter((y) => {
          return y.type === "validation";
        })
        .map((z) => z.avancement || -1),
    );

    const dispositifData = {
      _id: dispositif._id.toString(),
      titreInformatif: dispositif.translations.fr.content.titreInformatif,
      titreMarque: dispositif.translations.fr.content.titreMarque,
      nbMots: dispositif.nbMots,
      created_at: dispositif.created_at,
      type: dispositif.typeContenu,
      lastTradUpdatedAt,
      avancementTrad,
      avancementValidation,
    };

    /*
     * La traduction est présente dans le dispositif
     * Le dispositif est déjà traduit
     */
    if (dispositif.isTranslatedIn(locale)) {
      return results.push({
        ...dispositifData,
        avancementTrad: 1,
        avancementValidation: 1,
        tradStatus: TraductionsStatus.VALIDATED,
      });
    }

    /**
     * Si une traduction est à revoir
     */
    if (some(correspondingTrads, (trad) => trad.type === TraductionsType.VALIDATION && !isEmpty(trad.toReview))) {
      return results.push({
        ...dispositifData,
        tradStatus: TraductionsStatus.TO_REVIEW,
      });
    }

    /*
     * Aucune traduction suggérée n'est complète
     * Alors le dispositif est à traduire
     */
    if (some(correspondingTrads, (trad) => trad.type === TraductionsType.SUGGESTION && trad.avancement >= 1)) {
      return results.push({
        ...dispositifData,
        tradStatus: TraductionsStatus.PENDING,
      });
    }

    return results.push({
      ...dispositifData,
      tradStatus: TraductionsStatus.TO_TRANSLATE,
    });
  });

  logger.info("[getDispositifsWithTranslationAvancement] got results", { count: results.length });
  return results;
};
