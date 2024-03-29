import logger from "../../../logger";
import { addStructureForUsers } from "../../../modules/users/users.service";
import { createStructureInDB } from "../../../modules/structure/structure.repository";
import { log } from "./log";
import { Response } from "../../../types/interface";
import { ObjectId, Structure } from "../../../typegoose";
import { pick } from "lodash";
import { PostStructureRequest, StructureMemberRole } from "@refugies-info/api-types";

export const createStructure = async (body: PostStructureRequest, userId: string): Response => {
  logger.info("[createStructure] call received", { body });
  const structureToSave: Partial<Structure> = {
    ...pick(body, ["picture", "contact", "phone_contact", "mail_contact", "nom"]),
    createur: new ObjectId(userId),
    status: body.status,
    membres: body.responsable
      ? [
        {
          userId: new ObjectId(body.responsable),
          roles: [StructureMemberRole.ADMIN],
          added_at: new Date(),
        },
      ]
      : [],
  };

  const newStructure = await createStructureInDB(structureToSave);
  await log(newStructure._id, userId);

  const structureId = newStructure._id;
  if (newStructure.membres && newStructure.membres.length > 0) {
    // if we create a structure there is maximum one membre
    await addStructureForUsers([newStructure.membres[0].userId.toString()], structureId);
  }
  logger.info("[createStructure] successfully created structure with id", { structureId });

  return { text: "success" };
};
