import { Response } from "../../../types/interface";
import logger from "../../../logger";
import { deleteWidgetById } from "../../../modules/widgets/widgets.repository";

export const deleteWidget = async (id: string): Response => {
  logger.info("[deleteWidget] received", id);
  await deleteWidgetById(id);
  return { text: "success" }
};
