import type { GetAdminOptionResponse } from "@refugies-info/api-types";
import type { AdminOptions } from "@refugies-info/mongo";
import { NotFoundError } from "~/errors";
import logger from "~/logger";
import { getAdminOption } from "~/modules/adminOptions/adminOptions.repository";
import type { ResponseWithData } from "~/types/interface";

export const getAdminOptions = async (key: string): ResponseWithData<GetAdminOptionResponse> => {
  logger.info("[getAdminOptions] received");

  const adminOption = await getAdminOption(key);
  if (!adminOption) throw new NotFoundError("Option noud found");

  return {
    text: "success",
    data: adminOption.toObject<AdminOptions>() as GetAdminOptionResponse,
  };
};
