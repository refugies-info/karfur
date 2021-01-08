import { User } from "../../schema/schemaUser";
import { ObjectId } from "mongoose";

type NeededFields =
  | { username: number; picture: number }
  | { roles: 1; structures: 1 };

export const getUserById = async (id: ObjectId, neededFields: NeededFields) =>
  await User.findOne({ _id: id }, neededFields);

export const getAllUsersFromDB = async () =>
  await User.find({}, { username: 1, picture: 1, status: 1 });

export const updateUser = async (id: ObjectId, modifiedUser: any) =>
  await User.findOneAndUpdate({ _id: id }, modifiedUser, {
    upsert: true,
    // @ts-ignore
    new: true,
  });

export const removeRoleAndStructureInDB = async (
  roleId: ObjectId,
  userId: ObjectId,
  structureId: ObjectId
) =>
  await User.findByIdAndUpdate(
    { _id: userId },
    {
      $pull: {
        roles: roleId,
        structures: structureId,
      },
    },
    { upsert: true }
  );
