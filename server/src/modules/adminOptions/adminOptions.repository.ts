import { AdminOption, AdminOptionDoc } from "../../schema/schemaAdminOption";

export const getAdminOption = async (key: string) => {
  return AdminOption.findOne({ key: key });
}

export const createAdminOption = async (adminOption: AdminOptionDoc) => {
  return new AdminOption(adminOption).save();
}

export const updateAdminOption = async (key: string, value: any) => {
  return AdminOption.findOneAndUpdate({ key }, {value}, { upsert: true, new: true });
}

