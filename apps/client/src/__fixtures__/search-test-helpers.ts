import mongoose from "mongoose";

export const getOrRegisterModel = (conn: mongoose.Connection, modelName: string, schema: mongoose.Schema) => {
  try {
    return conn.model(modelName);
  } catch {
    return conn.model(modelName, schema);
  }
};
