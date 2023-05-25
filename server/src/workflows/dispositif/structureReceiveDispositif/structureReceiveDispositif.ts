import { DispositifStatus, StructureReceiveDispositifRequest } from "@refugies-info/api-types";
import logger from "../../../logger";
import { getDispositifById, updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { Response } from "../../../types/interface";
import { Dispositif, User } from "../../../typegoose";
import { InvalidRequestError, NotFoundError, UnauthorizedError } from "../../../errors";
import { log } from "./log";

export const structureReceiveDispositif = async (
  id: string,
  body: StructureReceiveDispositifRequest,
  user: User,
): Response => {
  logger.info("[structureReceiveDispositif] received", { id, body, user: user._id });

  const oldDispositif = await getDispositifById(id, { status: 1, creatorId: 1, mainSponsor: 1 }, "mainSponsor");
  if (!oldDispositif) throw new NotFoundError("The content has not been found");
  const editedDispositif: Partial<Dispositif> = {};

  if (oldDispositif.status !== DispositifStatus.WAITING_STRUCTURE) {
    throw new InvalidRequestError("The content cannot be accepted or rejected by the stucture");
  }
  if (!oldDispositif.getMainSponsor()?.membres.find((membre) => membre.userId.toString() === user._id.toString())) {
    throw new UnauthorizedError("You are not allowed to accept or reject this content", undefined, { id, user: user._id });
  }
  editedDispositif.status = body.accept ? DispositifStatus.WAITING_ADMIN : DispositifStatus.KO_STRUCTURE;

  const newDispositif = await updateDispositifInDB(id, editedDispositif);
  await log(newDispositif, oldDispositif, user._id);

  return { text: "success" };
};
