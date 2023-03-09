import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { getAdminOption } from "../../../modules/adminOptions/adminOptions.repository";
import { NotFoundError } from "../../../errors";
import { AdminOptions } from "../../../typegoose";
import { GetAdminOptionResponse } from "api-types";

export const getAdminOptions = async (key: string): ResponseWithData<GetAdminOptionResponse> => {
  logger.info("[getAdminOptions] received");

  const adminOption = await getAdminOption(key);
  if (!adminOption) throw new NotFoundError("Option noud found");

  return {
    text: "success",
    data: adminOption.toObject<AdminOptions>()
  }
}
