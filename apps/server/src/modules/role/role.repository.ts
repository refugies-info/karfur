import type { RoleName } from "@refugies-info/api-types";
import { RoleModel } from "@refugies-info/mongo";

export const getRoleByName = async (name: RoleName) => await RoleModel.findOne({ nom: name });

export const getRoles = async () => RoleModel.find();
