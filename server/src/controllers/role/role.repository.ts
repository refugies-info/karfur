import { RoleModel } from "src/typegoose";

export const getRoleByName = async (name: string) => await RoleModel.findOne({ nom: name });
