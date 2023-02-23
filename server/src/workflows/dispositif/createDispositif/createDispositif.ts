import logger from "../../../logger";
import { createDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { Response } from "../../../types/interface";
import { Dispositif, ObjectId } from "../../../typegoose";
import { ContentType, CreateDispositifRequest, DispositifStatus, Id } from "api-types";

export const createDispositif = async (body: CreateDispositifRequest, userId: Id): Response => {
  logger.info("[createDispositif] received", { body });

  const newDispositif: Partial<Dispositif> = {
    status: DispositifStatus.DRAFT,
    typeContenu: body.typeContenu,
    creatorId: new ObjectId(userId.toString()),
    lastModificationAuthor: new ObjectId(userId.toString()),
    themesSelectedByAuthor: true,
    // @ts-ignore asking for all languages?
    translations: {
      fr: {
        content: {
          titreInformatif: body.titreInformatif || "",
          titreMarque: body.titreMarque || "",
          abstract: body.abstract || "",
          what: body.what || "",
          how: body.how || {},
          ...(body.typeContenu === ContentType.DISPOSITIF) ? { why: body.why || {} } : { next: body.next || {} },
        },
        metadatas: {}
      }
    }
  };

  if (body.mainSponsor) newDispositif.mainSponsor = new ObjectId(body.mainSponsor);
  if (body.theme) newDispositif.theme = new ObjectId(body.theme);
  if (body.secondaryThemes) newDispositif.secondaryThemes = body.secondaryThemes.map(t => new ObjectId(t));
  if (body.metadatas) newDispositif.metadatas = body.metadatas;

  await createDispositifInDB(newDispositif);

  return { text: "success" };
};

