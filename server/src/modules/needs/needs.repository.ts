import { SimpleTheme } from "@refugies-info/api-types";
import { DeleteResult } from "../../types/interface";
import { Need, NeedId, NeedModel } from "../../typegoose";

export const createNeedInDB = async (need: Partial<Need>) => await new NeedModel(need).save();

export const getNeedsFromDB = async () => NeedModel.find().populate<{ theme: SimpleTheme }>("theme");

export const getNeedFromDB = async (id: NeedId) => NeedModel.findOne({ _id: id });

export const saveNeedInDB = async (needId: NeedId, need: Partial<Need>) => {
  return NeedModel.findOneAndUpdate({ _id: needId }, need, { upsert: true, new: true }).populate<{
    theme: SimpleTheme;
  }>("theme");
};

export const deleteNeedById = async (needId: NeedId): Promise<DeleteResult> => NeedModel.deleteOne({ _id: needId });

export const updatePositions = async (needIds: NeedId[]) => {
  return Promise.all(
    needIds.map((needId, i) =>
      NeedModel.findOneAndUpdate({ _id: needId }, { position: i }, { upsert: true, new: true }).populate<{
        theme: SimpleTheme;
      }>("theme"),
    ),
  );
};
