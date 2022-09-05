import { ObjectId } from "mongoose";
import { ThemeDoc } from "../../schema/schemaTheme";
import { NeedDoc, Need } from "../../schema/schemaNeeds";

export const createNeedInDB = async (need: Partial<NeedDoc>) =>
  await new Need(need).save();

export const getNeedsFromDB = async () => Need.find().populate<{ theme: ThemeDoc }>("theme");

export const saveNeedInDB = async (needId: ObjectId, need: Partial<NeedDoc>) => {
  return Need.findOneAndUpdate(
    { _id: needId },
    need,
    { upsert: true, new: true }
  );
}

export const deleteNeedById = async (needId: ObjectId) => {
  return Need.deleteOne({ _id: needId });
}

export const updatePositions = async (needIds: ObjectId[]) => {
  return Promise.all(
    needIds.map((needId, i) => Need.findOneAndUpdate(
      { _id: needId },
      { position: i },
      { upsert: true, new: true }
    ).populate<{ theme: ThemeDoc }>("theme"))
  )
}

