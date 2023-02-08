import { Log, LogId, LogModel } from "src/typegoose";

export const findLogs = async (id: LogId) => {
  return LogModel.find({ objectId: id })
    .populate("dynamicId", "nom username titreInformatif langueFr")
    .populate("author", "username")
    .sort({ created_at: -1 });
};

export const createLog = async (log: Log) => {
  return new LogModel(log).save();
};
