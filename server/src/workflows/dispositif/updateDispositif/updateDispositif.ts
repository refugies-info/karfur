import logger from "../../../logger";
import { getDispositifById, updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { Response } from "../../../types/interface";
import { Dispositif, ObjectId, User } from "../../../typegoose";
import { DemarcheContent, DispositifContent, TranslationContent } from "../../../typegoose/Dispositif";
import { checkUserIsAuthorizedToModifyDispositif } from "../../../libs/checkAuthorizations";
import { ContentType, UpdateDispositifRequest } from "api-types";

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
  const metadatas: TranslationContent["metadatas"] = {}
  if (body.metadatas?.important) metadatas.important = body.metadatas.important;
  if (body.metadatas?.duration) metadatas.duration = body.metadatas.duration;

  return {
    content,
    metadatas
  };
}

export const updateDispositif = async (id: string, body: UpdateDispositifRequest, user: User): Response => {
  logger.info("[updateDispositif] received", { id, body, user: user._id });

  const oldDispositif = await getDispositifById(id, { typeContenu: 1, translations: 1, mainSponsor: 1 }, "mainSponsor");
  checkUserIsAuthorizedToModifyDispositif(oldDispositif, user);

  const editedDispositif: Partial<Dispositif> = {
    lastModificationAuthor: user._id,
    themesSelectedByAuthor: !user.isAdmin(),
    translations: oldDispositif.translations
  };

  editedDispositif.translations.fr = buildDispositifContent(body, oldDispositif);
  if (body.mainSponsor) editedDispositif.mainSponsor = new ObjectId(body.mainSponsor);
  if (body.theme) editedDispositif.theme = new ObjectId(body.theme);
  if (body.secondaryThemes) editedDispositif.secondaryThemes = body.secondaryThemes.map(t => new ObjectId(t));
  if (body.metadatas) editedDispositif.metadatas = body.metadatas;

  await updateDispositifInDB(id, editedDispositif);
  // await log(dispositif, originalDispositif, req.user._id);

  return { text: "success" };
};

