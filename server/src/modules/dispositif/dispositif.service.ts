import { getDispositifByIdWithMainSponsor, updateDispositifInDB } from "./dispositif.repository";
import { updateLanguagesAvancement } from "../langues/langues.service";
import logger from "../../logger";
import { addOrUpdateDispositifInContenusAirtable } from "../../controllers/miscellaneous/airtable";
import { sendMailWhenDispositifPublished } from "../mail/sendMailWhenDispositifPublished";
import { sendNotificationsForDispositif } from "../../modules/notifications/notifications.service";
import { Dispositif, DispositifId, ObjectId, Structure, User, UserId } from "../../typegoose";
import { ContentType, CreateDispositifRequest, DemarcheContent, DispositifContent, DispositifStatus, InfoSections, StructureStatus, UpdateDispositifRequest } from "api-types";
import { createStructureInDB } from "../structure/structure.repository";
import { checkUserIsAuthorizedToDeleteDispositif } from "../../libs/checkAuthorizations";
import { getDispositifDepartments } from "../../libs/getDispositifDepartments";
import { log } from "./log";

export const publishDispositif = async (dispositifId: DispositifId, userId: UserId) => {
  const newDispositif = {
    status: DispositifStatus.ACTIVE,
    publishedAt: new Date(),
    publishedAtAuthor: userId,
  };

  const newDispo = await updateDispositifInDB(dispositifId, newDispositif);
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
    metadatas: 1
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
    true
  );

  await updateDispositifInDB(id, { status: DispositifStatus.DELETED });
}

export const buildNewDispositif = async (formContent: UpdateDispositifRequest | CreateDispositifRequest, userId: string): Promise<Partial<Dispositif>> => {
  const editedDispositif: Partial<Dispositif> = {};
  if (formContent.mainSponsor) {
    if (typeof formContent.mainSponsor === "string") { // existing structure
      editedDispositif.mainSponsor = new ObjectId(formContent.mainSponsor);
    } else { // create structure
      const structureToSave: Partial<Structure> = {
        status: StructureStatus.WAITING,
        picture: formContent.mainSponsor.logo,
        nom: formContent.mainSponsor.name,
        link: formContent.mainSponsor.link,
      };
      const newStructure = await createStructureInDB(structureToSave);
      editedDispositif.mainSponsor = newStructure._id;
      await log(newStructure._id, userId);
    }
  }
  if (formContent.contact) {
    // TODO save contact infos somewhere or in new structure. See createStructure.ts
  }
  if (formContent.theme) editedDispositif.theme = new ObjectId(formContent.theme);
  if (formContent.secondaryThemes) editedDispositif.secondaryThemes = formContent.secondaryThemes.map((t) => new ObjectId(t));
  if (formContent.metadatas) editedDispositif.metadatas = formContent.metadatas;
  if (formContent.map) editedDispositif.map = formContent.map;
  //@ts-ignore
  if (formContent.sponsors) editedDispositif.sponsors = formContent.sponsors; // FIXME picture type

  return editedDispositif;
}

const isAccordionOk = (content: InfoSections | undefined) => {
  if (!content) return false;
  return content && Object.keys(content).length >= 3 && !Object.values(content).find(c => !c.title || !c.text)
}

const isMetadataOk = (content: any) => {
  return content || content === null // ok if filled or null
}

export const isDispositifComplete = (dispositif: Dispositif) => {
  const content = dispositif.translations.fr.content;
  const conditions: boolean[] = [
    !!content.titreInformatif,
    !!content.titreMarque,
    !!content.what,
    dispositif.typeContenu === ContentType.DISPOSITIF ? isAccordionOk((content as DispositifContent).why) : isAccordionOk((content as DemarcheContent).how),
    dispositif.typeContenu === ContentType.DISPOSITIF ? isAccordionOk((content as DispositifContent).how) : isAccordionOk((content as DemarcheContent).next),
    !!content.abstract,
    !!dispositif.theme,
    dispositif.mainSponsor,
    isMetadataOk(dispositif.metadatas?.publicStatus),
    isMetadataOk(dispositif.metadatas?.age),
    isMetadataOk(dispositif.metadatas?.frenchLevel),
    isMetadataOk(dispositif.metadatas?.public),
    isMetadataOk(dispositif.metadatas?.price),
    isMetadataOk(dispositif.metadatas?.commitment),
    isMetadataOk(dispositif.metadatas?.frequency),
    isMetadataOk(dispositif.metadatas?.timeSlots),
    isMetadataOk(dispositif.metadatas?.conditions),
    isMetadataOk(dispositif.metadatas?.location)
  ];
  return conditions.filter(c => c).length;
}
