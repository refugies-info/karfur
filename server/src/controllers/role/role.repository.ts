import { RoleModel } from "../../typegoose";

// TODO: move in modules
export const getRoleByName = async (name: string) => await RoleModel.findOne({ nom: name });
