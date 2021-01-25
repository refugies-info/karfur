// @ts-nocheck
const Role = require("../../schema/schemaRole.js");

export const getRoleByName = async (name: string) =>
  await Role.findOne({ nom: name });
