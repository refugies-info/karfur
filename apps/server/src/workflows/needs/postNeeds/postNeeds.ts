import { NeedRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import { createNeedInDB } from "~/modules/needs/needs.repository";
import { Need } from "~/typegoose";
import { Response } from "~/types/interface";

export const postNeeds = async (body: NeedRequest): Response => {
  logger.info("[postNeeds] received", body);

  const needDB: Partial<Need> = {
    fr: {
      text: body.fr.text,
      subtitle: body.fr.subtitle,
      updatedAt: new Date(),
    },
    // image: body.image,
    theme: body.theme.toString(),
    adminComments: body.adminComments || "",
    position: 0,
  };

  await createNeedInDB(needDB);

  return { text: "success" };
};
