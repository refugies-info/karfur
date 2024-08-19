import { Log, LogModel } from "../../typegoose";

export const findLogs = async (id: string) => {
  return LogModel.find({ objectId: id })
    .populate<{ author: { username: string | undefined, email: string } }>("author", "username email")
    .sort({ created_at: -1 })
};

export const createLog = async (log: Log) => {
  return new LogModel(log).save();
};
