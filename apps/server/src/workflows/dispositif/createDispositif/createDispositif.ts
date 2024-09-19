import {
  ContentType,
  CreateDispositifRequest,
  DemarcheContent,
  DispositifContent,
  DispositifStatus,
  Id,
  PostDispositifsResponse,
  RoleName,
} from "@refugies-info/api-types";
import { countDispositifWords } from "~/libs/wordCounter";
import logger from "~/logger";
import { createDispositifInDB } from "~/modules/dispositif/dispositif.repository";
import { buildNewDispositif } from "~/modules/dispositif/dispositif.service";
import { logContact } from "~/modules/dispositif/log";
import { getRoleByName } from "~/modules/role/role.repository";
import { addRoleAndContribToUser } from "~/modules/users/users.repository";
import { Dispositif, ObjectId, StructureId, UserId } from "~/typegoose";
import { ResponseWithData } from "~/types/interface";

export const createDispositif = async (
  body: CreateDispositifRequest,
  userId: Id,
): ResponseWithData<PostDispositifsResponse> => {
  logger.info("[createDispositif] received", { body });

  const translation: DispositifContent | DemarcheContent = {
    titreInformatif: body.titreInformatif || "",
    titreMarque: body.titreMarque || "",
    abstract: body.abstract || "",
    what: body.what || "",
    how: body.how || {},
    ...(body.typeContenu === ContentType.DISPOSITIF
      ? {
          why: body.why || {},
        }
      : {
          next: body.next || {},
          administrationName: body.administration?.name || "",
        }),
  };
  const newDispositif: Partial<Dispositif> = {
    status: DispositifStatus.DRAFT,
    typeContenu: body.typeContenu,
    creatorId: new ObjectId(userId.toString()),
    participants: [new ObjectId(userId.toString())],
    lastModificationAuthor: new ObjectId(userId.toString()),
    themesSelectedByAuthor: true,
    webOnly: false,
    translations: {
      fr: {
        content: translation,
        created_at: new Date(),
        validatorId: new ObjectId(userId.toString()),
      },
    },
    nbMots: countDispositifWords(translation),
    ...(await buildNewDispositif(body, userId.toString())),
  };

  const dispositif = await createDispositifInDB(newDispositif);

  if (body.contact) {
    await logContact(userId as UserId, dispositif.mainSponsor as StructureId, body.contact);
  }

  const contribRole = await getRoleByName(RoleName.CONTRIB);
  await addRoleAndContribToUser(userId, contribRole._id, dispositif._id);

  return {
    text: "success",
    data: {
      id: dispositif._id,
      mainSponsor: (dispositif.mainSponsor as string) || null,
      typeContenu: dispositif.typeContenu,
      status: dispositif.status,
      hasDraftVersion: false,
    },
  };
};
