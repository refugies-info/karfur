import logger from "../../../logger";
import { createDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { ResponseWithData } from "../../../types/interface";
import { Dispositif, ObjectId, UserId } from "../../../typegoose";
import {
  ContentType,
  CreateDispositifRequest,
  DispositifStatus,
  Id,
  PostDispositifsResponse,
} from "@refugies-info/api-types";
import { buildNewDispositif } from "../../../modules/dispositif/dispositif.service";
import { getRoleByName } from "../../../modules/role/role.repository";
import { addRoleAndContribToUser } from "../../../modules/users/users.repository";
import { logContact } from "../../../modules/dispositif/log";

export const createDispositif = async (
  body: CreateDispositifRequest,
  userId: Id,
): ResponseWithData<PostDispositifsResponse> => {
  logger.info("[createDispositif] received", { body });

  const newDispositif: Partial<Dispositif> = {
    status: DispositifStatus.DRAFT,
    typeContenu: body.typeContenu,
    creatorId: new ObjectId(userId.toString()),
    lastModificationAuthor: new ObjectId(userId.toString()),
    themesSelectedByAuthor: true,
    translations: {
      fr: {
        content: {
          titreInformatif: body.titreInformatif || "",
          titreMarque: body.titreMarque || "",
          abstract: body.abstract || "",
          what: body.what || "",
          how: body.how || {},
          ...(body.typeContenu === ContentType.DISPOSITIF ? { why: body.why || {} } : { next: body.next || {} }),
        },
        created_at: new Date(),
        validatorId: new ObjectId(userId.toString()),
      },
    },
    ...(await buildNewDispositif(body, userId.toString())),
  };

  const dispositif = await createDispositifInDB(newDispositif);

  if (body.contact) {
    await logContact(dispositif._id, userId as UserId, body.contact)
  }

  const contribRole = await getRoleByName("Contrib");
  await addRoleAndContribToUser(userId, contribRole._id, dispositif._id);

  return {
    text: "success",
    data: {
      id: dispositif._id,
      mainSponsor: dispositif.mainSponsor as string || null,
      typeContenu: dispositif.typeContenu,
      status: dispositif.status,
      hasDraftVersion: false
    }
  };
};
