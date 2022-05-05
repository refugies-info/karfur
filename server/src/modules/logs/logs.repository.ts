import { Log, LogDoc } from "schema/schemaLog";

export const getLogs = async (id: string) => {
  return Log.find({ object: id })
}

export const createLog = async (log: LogDoc) => {
  return new Log(log).save();
}
