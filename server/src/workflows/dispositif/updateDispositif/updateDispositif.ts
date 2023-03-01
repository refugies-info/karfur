import logger from "../../../logger";
import { getDispositifById, updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { Response } from "../../../types/interface";
import { Dispositif, ObjectId, Traductions, TraductionsModel, User } from "../../../typegoose";
import { DemarcheContent, DispositifContent, TranslationContent } from "../../../typegoose/Dispositif";
import { checkUserIsAuthorizedToModifyDispositif } from "../../../libs/checkAuthorizations";
import { ContentType, Languages, UpdateDispositifRequest } from "api-types";
import { cloneDeep, isEmpty, unset } from "lodash";
import { TraductionsType } from "src/typegoose/Traductions";

const buildDispositifContent = (body: UpdateDispositifRequest, oldDispositif: Dispositif): TranslationContent => {
  // content
  const content = { ...oldDispositif.translations.fr.content };
  if (body.titreInformatif) content.titreInformatif = body.titreInformatif;
  if (body.titreMarque) content.titreMarque = body.titreMarque;
  if (body.abstract) content.abstract = body.abstract;
  if (body.what) content.what = body.what;

  if (oldDispositif.typeContenu === ContentType.DISPOSITIF) {
    if (body.why) (content as DispositifContent).why = body.why;
    if (body.how) content.how = body.how;
  } else {
    if (body.how) content.how = body.how;
    if (body.next) (content as DemarcheContent).next = body.next;
  }

  // metadatas
  const metadatas: TranslationContent["metadatas"] = {};
  if (body.metadatas?.important) metadatas.important = body.metadatas.important;
  if (body.metadatas?.duration) metadatas.duration = body.metadatas.duration;

  return {
    content,
    metadatas,
    created_at: oldDispositif.translations.fr.created_at,
  };
};

const buildTranslations = async (
  dispositif: Dispositif,
  translationContent: TranslationContent,
): Promise<Dispositif["translations"]> => {
  const translations = dispositif.translations;
  /**
   * Calcul des changements qui doivent être revus en traduction
   */
  const traductionDiff = Traductions.diff(translations.fr, translationContent);
  logger.info("[updateDispositif] traduction changes ", traductionDiff);

  const newTranslations = cloneDeep(translations);

  /**
   * On retire les sections supprimées de la nouvelle traduction
   * de l'ensemble des traductions existantes validées.
   *
   * TODO Supprimer aussi dans les traductions proposées + update avancement
   *
   * Pas de nouvelle traduction nécessaire si uniquement des suppressions.
   */
  if (!isEmpty(traductionDiff.removed)) {
    Object.keys(translations).forEach((locale) => {
      traductionDiff.removed.forEach((section) => {
        unset(newTranslations, `${locale}.${section}`);
      });
    });
    translationContent.created_at = new Date();
  }

  const toReview: string[] = [];

  /**
   * Dans ce cas on pourrait choisir en fonction des sections
   * et des modifications faites si l'on garde ou pas les traductions actives
   */
  if (!isEmpty(traductionDiff.modified)) {
    // FIXME implémenter les règles d'exceptions ici

    toReview.push(...traductionDiff.modified);
  }

  /**
   * Dans ce cas, on doit obligatoirement repasser par la phase de traduction
   * avec toReview qui est égal aux sections ajoutées
   */
  if (!isEmpty(traductionDiff.added)) {
    toReview.push(...traductionDiff.added);
  }
  logger.info("[updateDispositif] traduction to review ", toReview);

  /**
   * TODO
   * Supprimer les traductions hors fr dans le dispositif
   * +
   * Créer des traductions "validation" avec la section toReview correctement renseignée
   */
  if (!isEmpty(toReview)) {
    // Invalidation des traductions
    const translationsReviews = Object.entries(newTranslations)
      .filter(([locale]) => locale !== "fr")
      .map(([locale, value]) => {
        const translation = new Traductions();
        translation.dispositifId = dispositif._id;
        translation.language = locale as Languages;
        translation.translated = value;
        translation.timeSpent = 0;
        translation.type = TraductionsType.VALIDATION;
        translation.toReview = toReview;
        translation.userId = dispositif.creatorId; // FIXME => validatorId
        // translation.validatorId = ????
        translation.avancement = Traductions.computeAvancement(dispositif, translation);
        return translation;
      });
    logger.info("translationsReviews", translationsReviews);

    translationContent.created_at = new Date();

    await TraductionsModel.insertMany(translationsReviews).then((result) => {
      logger.info(`[updateDispositif] ${translationsReviews.length} traductions created for review `, result);
    });

    // Retourne les traductions avec uniquement le français à jour
    return { fr: translationContent };
  }

  return { ...newTranslations, fr: translationContent };
};

export const updateDispositif = async (id: string, body: UpdateDispositifRequest, user: User): Response => {
  logger.info("[updateDispositif] received", { id, body, user: user._id });

  const oldDispositif = await getDispositifById(id, { typeContenu: 1, translations: 1, mainSponsor: 1 }, "mainSponsor");
  checkUserIsAuthorizedToModifyDispositif(oldDispositif, user);

  const translationContent = buildDispositifContent(body, oldDispositif);

  const translations = await buildTranslations(oldDispositif, translationContent);
  const editedDispositif: Partial<Dispositif> = {
    lastModificationAuthor: user._id,
    themesSelectedByAuthor: !user.isAdmin(),
    translations,
  };

  if (body.mainSponsor) editedDispositif.mainSponsor = new ObjectId(body.mainSponsor);
  if (body.theme) editedDispositif.theme = new ObjectId(body.theme);
  if (body.secondaryThemes) editedDispositif.secondaryThemes = body.secondaryThemes.map((t) => new ObjectId(t));
  if (body.metadatas) editedDispositif.metadatas = body.metadatas;

  await updateDispositifInDB(id, editedDispositif);
  // await log(dispositif, originalDispositif, req.user._id);

  return { text: "success" };
};
