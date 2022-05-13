import { ObjectId } from "mongoose";
import { Log, LogDoc } from "../../schema/schemaLog";

export const findLogs = async (id: ObjectId) => {
  return Log.find({ objectId: id })
    .populate("dynamicId", "name username titreInformatif")
    .populate("author", "username")
    .sort({ created_at: -1 });
}

export const createLog = async (log: LogDoc) => {
  return new Log(log).save();
}
