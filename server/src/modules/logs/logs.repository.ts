import { Log, LogModel } from "../../typegoose";

export const findLogs = async (id: string) => {
  return LogModel.find({ objectId: id })
    .populate<{
      dynamicId: {
        nom?: string
        username?: string
        titreInformatif?: string
        langueFr?: string
      }
    }>("dynamicId", "nom username titreInformatif langueFr")
    .populate<{ author: { username: string } }>("author", "username")
    .sort({ created_at: -1 })
};

export const createLog = async (log: Log) => {
  return new LogModel(log).save();
};
