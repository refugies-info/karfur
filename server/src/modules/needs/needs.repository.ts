import { ThemeDoc } from "src/schema/schemaTheme";
import { NeedDoc, Need } from "../../schema/schemaNeeds";

export const createNeedInDB = async (need: NeedDoc) =>
  await new Need(need).save();

export const getNeedsFromDB = async () => Need.find().populate<{ theme: ThemeDoc }>("theme");

export const saveNeedInDB = async (need: any) =>
  await Need.findOneAndUpdate(
    { _id: need._id },
    need,
    // @ts-ignore
    { upsert: true, new: true }
  );
