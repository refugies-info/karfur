import { Need, NeedId, NeedModel, Theme } from "src/typegoose";

export const createNeedInDB = async (need: Partial<Need>) => await new NeedModel(need).save();

export const getNeedsFromDB = async () => NeedModel.find().populate<{ theme: Theme }>("theme");

export const getNeedFromDB = async (id: NeedId) => NeedModel.findOne({ _id: id });

export const saveNeedInDB = async (needId: NeedId, need: Partial<Need>) => {
  return NeedModel.findOneAndUpdate({ _id: needId }, need, { upsert: true, new: true });
};

export const deleteNeedById = async (needId: NeedId) => {
  return NeedModel.deleteOne({ _id: needId });
};

export const updatePositions = async (needIds: NeedId[]) => {
  return Promise.all(
    needIds.map((needId, i) =>
      NeedModel.findOneAndUpdate({ _id: needId }, { position: i }, { upsert: true, new: true }).populate<{
        theme: Theme;
      }>("theme")
    )
  );
};
