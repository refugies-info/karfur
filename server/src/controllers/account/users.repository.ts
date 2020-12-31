import { User } from "../../schema/schemaUser";
import { ObjectId } from "mongoose";

export const getUserById = async (id: ObjectId) =>
  await User.findOne({ _id: id }, { username: 1, picture: 1 });
