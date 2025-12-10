import {
  ContentType,
  DispositifStatus,
  type StructureReceiveDispositifRequest,
} from "@refugies-info/api-types";
import { InvalidRequestError, NotFoundError, UnauthorizedError } from "~/errors";
import logger from "~/logger";
import { getDispositifMainSponsor } from "~/modules/dispositif/dispositif.business";
import {
  getDispositifById,
  updateDispositifInDB,
} from "~/modules/dispositif/dispositif.repository";
import { takeSnapshot } from "~/modules/snapshots/snapshots.service";
import type { Dispositif, User } from "~/typegoose";
import type { Response } from "~/types/interface";
import { log } from "./log";

export const structureReceiveDispositif = async (
  id: string,
  body: StructureReceiveDispositifRequest,
  user: User,
): Response => {
  logger.info("[structureReceiveDispositif] received", { id, body, user: user._id });

  const oldDispositif = await getDispositifById(
    id,
    { status: 1, creatorId: 1, mainSponsor: 1, typeContenu: 1 },
    "mainSponsor",
  );
  if (!oldDispositif) throw new NotFoundError("The content has not been found");
  const editedDispositif: Partial<Dispositif> = {};

  if (oldDispositif.status !== DispositifStatus.WAITING_STRUCTURE) {
    throw new InvalidRequestError("The content cannot be accepted or rejected by the stucture");
  }
  const mainSponsor = getDispositifMainSponsor(oldDispositif);
  if (!mainSponsor?.membres.find((membre) => membre.userId.toString() === user._id.toString())) {
    throw new UnauthorizedError("You are not allowed to accept or reject this content", undefined, {
      id,
      user: user._id,
    });
  }
  editedDispositif.status = body.accept
    ? DispositifStatus.WAITING_ADMIN
    : DispositifStatus.KO_STRUCTURE;

  const newDispositif = await updateDispositifInDB(id, editedDispositif);
  if (
    oldDispositif.typeContenu === ContentType.DISPOSITIF &&
    newDispositif.status === DispositifStatus.WAITING_ADMIN
  ) {
    await takeSnapshot(newDispositif, "before", oldDispositif.status, newDispositif.status);
  }
  await log(newDispositif, oldDispositif, user._id);

  return { text: "success" };
};
