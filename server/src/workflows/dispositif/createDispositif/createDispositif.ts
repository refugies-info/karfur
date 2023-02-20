import logger from "../../../logger";
import { createDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { CreateDispositifRequest } from "../../../controllers/dispositifController";
import { Response } from "../../../types/interface";
import { Dispositif, Id } from "../../../typegoose";

export const createDispositif = async (body: CreateDispositifRequest, userId: Id): Response => {
  logger.info("[createDispositif] received", { body });

  const newDispositif: Partial<Dispositif> = {
    status: "Brouillon",
    typeContenu: body.typeContenu,
    creatorId: userId,
    lastModificationAuthor: userId,
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
          ...(body.typeContenu === "dispositif") ? { why: body.why || {} } : { next: body.next || {} },
        },
        metadatas: {}
      }
    }
  };

  if (body.mainSponsor) newDispositif.mainSponsor = new Id(body.mainSponsor);
  if (body.theme) newDispositif.theme = new Id(body.theme);
  if (body.secondaryThemes) newDispositif.secondaryThemes = body.secondaryThemes.map(t => new Id(t));
  if (body.metadatas) newDispositif.metadatas = body.metadatas;

  await createDispositifInDB(newDispositif);

  return { text: "success" };
};

