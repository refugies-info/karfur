import type { GetAdminOptionResponse } from "@refugies-info/api-types";
import { NotFoundError } from "~/errors";
import logger from "~/logger";
import { getAdminOption } from "~/modules/adminOptions/adminOptions.repository";
import type { AdminOptions } from "~/typegoose";
import type { ResponseWithData } from "~/types/interface";

export const getAdminOptions = async (key: string): ResponseWithData<GetAdminOptionResponse> => {
  logger.info("[getAdminOptions] received");

  const adminOption = await getAdminOption(key);
  if (!adminOption) throw new NotFoundError("Option noud found");

  return {
    text: "success",
    data: adminOption.toObject<AdminOptions>(),
  };
};
