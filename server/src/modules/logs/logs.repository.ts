import { Log, LogModel } from "src/typegoose";

export const findLogs = async (id: string) => {
  return LogModel.find({ objectId: id })
    .populate<{ dynamicId: string }>("dynamicId", "nom username titreInformatif langueFr")
    .populate<{ author: string }>("author", "username")
    .sort({ created_at: -1 })
};

export const createLog = async (log: Log) => {
  return new LogModel(log).save();
};
