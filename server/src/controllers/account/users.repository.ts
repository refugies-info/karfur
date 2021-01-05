import { User } from "../../schema/schemaUser";
import { ObjectId } from "mongoose";

export const getUserById = async (id: ObjectId) =>
  await User.findOne({ _id: id }, { username: 1, picture: 1 });

export const getAllUsersFromDB = async () =>
  await User.find({}, { username: 1, picture: 1, status: 1 });
