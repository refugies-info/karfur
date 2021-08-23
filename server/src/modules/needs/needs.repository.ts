import { NeedDoc, Need } from "../../schema/schemaNeeds";

export const createNeedInDB = async (need: NeedDoc) =>
  await new Need(need).save();

export const getNeedsFromDB = async () => await Need.find();
