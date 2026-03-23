import { ObjectId } from "@refugies-info/mongo";
import logger from "~/logger";
import { deleteWidgetById } from "~/modules/widgets/widgets.repository";
import type { Response } from "~/types/interface";

export const deleteWidget = async (id: string): Response => {
  logger.info("[deleteWidget] received", id);
  await deleteWidgetById(new ObjectId(id));
  return { text: "success" };
};
