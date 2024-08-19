import { AdminOptions, AdminOptionsModel } from "../../typegoose";

export const getAdminOption = async (key: string) => AdminOptionsModel.findOne({ key: key });

export const createAdminOption = async (adminOption: AdminOptions) => AdminOptionsModel.create(adminOption);

export const updateAdminOption = async (key: string, value: any) =>
  AdminOptionsModel.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
