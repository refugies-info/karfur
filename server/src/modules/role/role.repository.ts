import { RoleName } from "@refugies-info/api-types";
import { RoleModel } from "../../typegoose";

export const getRoleByName = async (name: RoleName) => await RoleModel.findOne({ nom: name });

export const getRoles = async () => RoleModel.find();
