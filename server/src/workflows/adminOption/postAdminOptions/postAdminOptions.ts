import logger from "../../../logger";
import {
  getAdminOption,
  createAdminOption,
  updateAdminOption
} from "../../../modules/adminOptions/adminOptions.repository";
import { AdminOptions, AdminOptionsModel } from "../../../typegoose";
import { AdminOptionRequest } from "../../../controllers/adminOptionController";
import { ResponseWithData } from "../../../types/interface";

export interface PostAdminOptionResponse {
  key: string;
  value: any;
}

export const postAdminOptions = async (key: string, body: AdminOptionRequest): ResponseWithData<PostAdminOptionResponse> => {
  logger.info("[postAdminOptions] received", body);

  let updatedAdminOption = null;
  const adminOption = await getAdminOption(key);
  if (adminOption) {
    updatedAdminOption = await updateAdminOption(key, body.value);
  } else {
    const newOption = new AdminOptionsModel({
      key: key,
      value: body.value
    });
    updatedAdminOption = await createAdminOption(newOption);
  }

  return {
    text: "success",
    data: updatedAdminOption.toObject<AdminOptions>()
  }
};


