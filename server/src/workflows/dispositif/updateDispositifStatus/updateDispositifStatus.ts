import logger from "../../../logger";
import {
  updateDispositifInDB,
  getDispositifByIdWithMainSponsor
} from "../../../modules/dispositif/dispositif.repository";
import { publishDispositif } from "../../../modules/dispositif/dispositif.service";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import { checkUserIsAuthorizedToDeleteDispositif } from "../../../libs/checkAuthorizations";
import { log } from "./log";
import { getDispositifDepartments } from "../../../libs/getDispositifDepartments";
import { Dispositif, User } from "../../../typegoose";
import { Response } from "../../../types/interface";
import { AuthenticationError } from "../../../errors";
import { DispositifStatusRequest, DispositifStatus } from "api-types";

export const updateDispositifStatus = async (id: string, body: DispositifStatusRequest, user: User): Response => {
  logger.info("[updateDispositifStatus]", { id, body });
  await log(id, body.status, user._id);

  if (body.status === DispositifStatus.ACTIVE) {
    if (!user.isAdmin()) throw new AuthenticationError("You cannot publish a dispositif");
    await publishDispositif(id, user._id);
    return { text: "success" };
  }

  if (body.status === DispositifStatus.DELETED) {
    const neededFields = {
      creatorId: 1,
      mainSponsor: 1,
      status: 1,
      typeContenu: 1,
      contenu: 1
    };

    const dispositif = await getDispositifByIdWithMainSponsor(id, neededFields);
    checkUserIsAuthorizedToDeleteDispositif(dispositif, user);

    await addOrUpdateDispositifInContenusAirtable(
      dispositif.translations.fr.content.titreInformatif,
      dispositif.translations.fr.content.titreMarque,
      dispositif._id,
      [],
      dispositif.typeContenu,
      null,
      getDispositifDepartments(dispositif),
      true
    );
  }

  const newDispositif: Partial<Dispositif> = { status: body.status };
  await updateDispositifInDB(id, newDispositif);
  return { text: "success" };
};
