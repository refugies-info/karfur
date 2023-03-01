import { RoleModel } from "../../typegoose";

export const getRoleByName = async (name: string) => await RoleModel.findOne({ nom: name });

export const getRoles = async () => RoleModel.find();
