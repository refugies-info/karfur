import { DispositifStatus, type DispositifStatusRequest } from "@refugies-info/api-types";
import { notifyGoogleUrlDeleted } from "~/libs/googleIndexingApi";
import logger from "~/logger";
import {
  deleteDispositifInDb,
  publishDispositif,
  saveAndOverwriteDraft,
} from "~/modules/dispositif/dispositif.service";
import { sendMailWhenDispositifArchived } from "~/modules/mail/sendMailWhenDispositifArchived";
import { type Dispositif, ObjectId, type User } from "~/typegoose";
import type { Response } from "~/types/interface";
import { log } from "./log";

export const updateDispositifStatus = async (
  id: string,
  body: DispositifStatusRequest,
  user: User,
): Response => {
  logger.info("[updateDispositifStatus]", { id, body });
  await log(id, body.status, user._id);

  if (body.status === DispositifStatus.ACTIVE) {
    await publishDispositif(id, user._id);
    return { text: "success" };
  }
  if (body.status === DispositifStatus.DELETED) {
    await deleteDispositifInDb(id, user);
    // Notify Google to remove from index (only in production)
    if (process.env.NODE_ENV === "production") {
      notifyGoogleUrlDeleted(`${process.env.FRONT_SITE_URL}/fr/dispositif/${id}`).catch((error) =>
        logger.error("[updateDispositifStatus] Failed to notify Google", {
          id,
          error: error instanceof Error ? error.message : String(error),
          ...(process.env.NODE_ENV !== "production" &&
            process.env.NODE_ENV !== "staging" &&
            error instanceof Error && { stack: error.stack }),
        }),
      );
    }
    return { text: "success" };
  }

  const updatedDispositif: Partial<Dispositif> = { status: body.status };
  await saveAndOverwriteDraft(id, updatedDispositif, true); // overwrite with draft if available

  if (body.status === DispositifStatus.ARCHIVED) {
    await sendMailWhenDispositifArchived(new ObjectId(id));
    // Notify Google to remove from index (only in production)
    if (process.env.NODE_ENV === "production") {
      notifyGoogleUrlDeleted(`${process.env.FRONT_SITE_URL}/fr/dispositif/${id}`).catch((error) =>
        logger.error("[updateDispositifStatus] Failed to notify Google", {
          id,
          error: error instanceof Error ? error.message : String(error),
          ...(process.env.NODE_ENV !== "production" &&
            process.env.NODE_ENV !== "staging" &&
            error instanceof Error && { stack: error.stack }),
        }),
      );
    }
  }

  return { text: "success" };
};
