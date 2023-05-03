import { deleteDraftDispositif, getDispositifById, getDispositifByIdWithMainSponsor, getDraftDispositifById, updateDispositifInDB } from "./dispositif.repository";
import { updateLanguagesAvancement } from "../langues/langues.service";
import logger from "../../logger";
import { cloneDeep, isEmpty, omit, unset } from "lodash";
import { TraductionsType } from "../../typegoose/Traductions";
import { addOrUpdateDispositifInContenusAirtable } from "../../controllers/miscellaneous/airtable";
import { sendMailWhenDispositifPublished } from "../mail/sendMailWhenDispositifPublished";
import { sendNotificationsForDispositif } from "../../modules/notifications/notifications.service";
import { Dispositif, DispositifId, ObjectId, Structure, Traductions, TraductionsModel, User, UserId } from "../../typegoose";
import {
  ContentType,
  CreateDispositifRequest,
  DemarcheContent,
  DispositifContent,
  DispositifStatus,
  InfoSections,
  Languages,
  StructureStatus,
  UpdateDispositifRequest,
} from "@refugies-info/api-types";
import { createStructureInDB } from "../structure/structure.repository";
import { checkUserIsAuthorizedToDeleteDispositif } from "../../libs/checkAuthorizations";
import { getDispositifDepartments } from "../../libs/getDispositifDepartments";
import { log } from "./log";
import { TranslationContent } from "../../typegoose/Dispositif";


export const rebuildTranslations = async (
  dispositif: Dispositif,
  translationContent: TranslationContent,
  keepTranslations: boolean
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

  if (!keepTranslations) {
    const toReview: string[] = [];

    /**
     * Dans ce cas on pourrait choisir en fonction des sections
     * et des modifications faites si l'on garde ou pas les traductions actives
     */
    if (!isEmpty(traductionDiff.modified)) {
      // TODO implémenter les règles d'exceptions ici :
      // - bloc callout <-> important = pas de review
      // - lien qui change = pas de review

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
          translation.translated = omit(value, "validatorId");
          translation.timeSpent = 0;
          translation.type = TraductionsType.VALIDATION;
          translation.toReview = toReview;
          translation.userId = value.validatorId;
          translation.avancement = Traductions.computeAvancement(dispositif, translation);
          return translation;
        });
      logger.info("translationsReviews", translationsReviews);

      translationContent.created_at = new Date();

      await TraductionsModel.insertMany(translationsReviews).then((result) => {
        logger.info(`[updateDispositif] ${translationsReviews.length} traductions created for review `, result);
      });

      // Retourne les traductions avec uniquement le français à jour, pour faire sauter les autres langues
      return { fr: translationContent };
    }
  }

  return { ...newTranslations, fr: translationContent };
};

export const publishDispositif = async (dispositifId: DispositifId, userId: UserId, keepTranslations?: boolean) => {
  const oldDispositif = await getDispositifById(
    dispositifId,
    { status: 1, creatorId: 1, theme: 1, mainSponsor: 1, translations: 1, typeContenu: 1, metadatas: 1, hasDraftVersion: 1 }
  );

  let draftDispositif = null;
  if (oldDispositif.hasDraftVersion) {
    draftDispositif = await getDraftDispositifById(
      dispositifId,
      {
        status: 1,
        creatorId: 1,
        theme: 1,
        secondaryThemes: 1,
        map: 1,
        sponsors: 1,
        mainSponsor: 1,
        translations: 1,
        typeContenu: 1,
        metadatas: 1,
        hasDraftVersion: 1,
        lastModificationDate: 1,
        lastModificationAuthor: 1,
        needs: 1
      }
    );
  }

  const newDispositif: Partial<Dispositif> = {
    status: DispositifStatus.ACTIVE,
    publishedAt: new Date(),
    publishedAtAuthor: userId,
    hasDraftVersion: false
  };

  if (draftDispositif) {
    const newTranslations = await rebuildTranslations(oldDispositif, draftDispositif.translations.fr, keepTranslations || false);
    newDispositif.translations = newTranslations;
    newDispositif.mainSponsor = draftDispositif.mainSponsor;
    newDispositif.theme = draftDispositif.theme;
    newDispositif.secondaryThemes = draftDispositif.secondaryThemes;
    newDispositif.metadatas = draftDispositif.metadatas;
    newDispositif.map = draftDispositif.map;
    newDispositif.sponsors = draftDispositif.sponsors;
    newDispositif.lastModificationDate = draftDispositif.lastModificationDate;
    newDispositif.lastModificationAuthor = draftDispositif.lastModificationAuthor;
    newDispositif.needs = draftDispositif.needs;
  }

  const newDispo = await updateDispositifInDB(dispositifId, newDispositif);
  if (draftDispositif) await deleteDraftDispositif(dispositifId);

  try {
    await updateLanguagesAvancement();
  } catch (error) {
    logger.error("[publishDispositif] error while updating languages avancement", { error: error.message });
  }

  const themesList = [newDispo.getTheme(), ...newDispo.getSecondaryThemes()];

  try {
    await addOrUpdateDispositifInContenusAirtable(
      newDispo.translations.fr.content.titreInformatif,
      newDispo.translations.fr.content.titreMarque,
      newDispo._id,
      themesList,
      newDispo.typeContenu,
      null,
      newDispo.getDepartements(),
      false,
    );
  } catch (error) {
    logger.error("[publishDispositif] error while updating contenu in airtable", { error: error.message });
  }

  try {
    await sendNotificationsForDispositif(dispositifId, "fr");
  } catch (error) {
    logger.error("[publishDispositif] error while sending notifications", error);
  }

  try {
    await sendMailWhenDispositifPublished(newDispo);
  } catch (error) {
    logger.error("[publishDispositif] error while sending email", {
      error: error.message,
    });
  }
};

export const deleteDispositifInDb = async (id: string, user: User) => {
  const neededFields = {
    creatorId: 1,
    mainSponsor: 1,
    status: 1,
    typeContenu: 1,
    contenu: 1,
    translations: 1,
    metadatas: 1,
  };

  const dispositif = await getDispositifByIdWithMainSponsor(id, neededFields);
  checkUserIsAuthorizedToDeleteDispositif(dispositif, user);

  await addOrUpdateDispositifInContenusAirtable(
    dispositif.translations?.fr?.content?.titreInformatif || "",
    dispositif.translations?.fr?.content?.titreMarque || "",
    dispositif._id,
    [],
    dispositif.typeContenu,
    null,
    getDispositifDepartments(dispositif),
    true,
  );

  await updateDispositifInDB(id, { status: DispositifStatus.DELETED });
};

export const buildNewDispositif = async (
  formContent: UpdateDispositifRequest | CreateDispositifRequest,
  userId: string,
): Promise<Partial<Dispositif>> => {
  const editedDispositif: Partial<Dispositif> = {};
  if (formContent.mainSponsor === null) {
    editedDispositif.mainSponsor = null;
  } else if (formContent.mainSponsor) {
    if (typeof formContent.mainSponsor === "string") {
      // existing structure
      editedDispositif.mainSponsor = new ObjectId(formContent.mainSponsor);
    } else {
      // create structure
      const structureToSave: Partial<Structure> = {
        status: StructureStatus.WAITING,
        picture: formContent.mainSponsor.logo,
        nom: formContent.mainSponsor.name,
        link: formContent.mainSponsor.link,
        createur: new ObjectId(userId),
      };
      const newStructure = await createStructureInDB(structureToSave);
      editedDispositif.mainSponsor = newStructure._id;
      await log(newStructure._id, userId);
    }
  }
  if (formContent.theme) editedDispositif.theme = new ObjectId(formContent.theme);
  if (formContent.secondaryThemes)
    editedDispositif.secondaryThemes = formContent.secondaryThemes.map((t) => new ObjectId(t));
  if (formContent.metadatas) editedDispositif.metadatas = formContent.metadatas;
  if (formContent.map) editedDispositif.map = formContent.map;
  //@ts-ignore
  if (formContent.sponsors) editedDispositif.sponsors = formContent.sponsors; // TODO picture type

  return editedDispositif;
};



const isAccordionOk = (content: InfoSections | undefined, max: number): boolean => {
  if (!content) return false;
  return Object.keys(content).length >= max && !Object.values(content).find((c) => !c.title || !c.text);
};

const isMetadataOk = (content: any): boolean => {
  return !!content || content === null; // ok if filled or null
};

export const isDispositifComplete = (dispositif: Dispositif) => {
  const content = dispositif.translations.fr.content;
  const conditions: boolean[] = [
    !!content.titreInformatif,
    !!content.titreMarque,
    !!content.what,
    dispositif.typeContenu === ContentType.DISPOSITIF
      ? isAccordionOk((content as DispositifContent).why, 3)
      : isAccordionOk((content as DemarcheContent).how, 3),
    dispositif.typeContenu === ContentType.DISPOSITIF
      ? isAccordionOk((content as DispositifContent).how, 1)
      : isAccordionOk((content as DemarcheContent).next, 1),
    !!content.abstract,
    !!dispositif.theme,
    !!dispositif.mainSponsor,
    isMetadataOk(dispositif.metadatas?.publicStatus),
    isMetadataOk(dispositif.metadatas?.age),
    isMetadataOk(dispositif.metadatas?.frenchLevel),
    isMetadataOk(dispositif.metadatas?.public),
    isMetadataOk(dispositif.metadatas?.price),
    isMetadataOk(dispositif.metadatas?.commitment),
    isMetadataOk(dispositif.metadatas?.frequency),
    isMetadataOk(dispositif.metadatas?.timeSlots),
    isMetadataOk(dispositif.metadatas?.conditions),
    isMetadataOk(dispositif.metadatas?.location),
  ];
  return conditions.filter((c) => !c).length === 0;
};
