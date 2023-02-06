import { FilterQuery, Types } from "mongoose";
import { StructureId, User, UserModel } from "src/typegoose";
import { UserId, USER_STATUS_ACTIVE } from "src/typegoose/User";

type NeededFields = { username: number; picture: number } | { roles: 1; structures: 1 } | { roles: 1 } | {};

export const getUserById = async (id: UserId, neededFields: NeededFields) =>
  await UserModel.findOne({ _id: id }, neededFields);

export const getUsersById = async (ids: UserId[], neededFields: NeededFields) =>
  await UserModel.find({ _id: { $in: ids } }, neededFields);

export const findUsers = (filter: FilterQuery<User>, neededFields: Record<string, number> = {}) =>
  UserModel.find(filter, neededFields);

export const getAllUsersFromDB = async (neededFields: Record<string, number>, populate: string = "roles structures") =>
  await UserModel.find({ status: USER_STATUS_ACTIVE }, neededFields).populate(populate);

export const updateUserInDB = async (id: UserId, modifiedUser: any) =>
  await UserModel.findOneAndUpdate({ _id: id }, modifiedUser, {
    upsert: true,
    new: true
  });

export const addStructureForUsersInDB = (userIds: UserId[], structureId: StructureId) =>
  UserModel.updateMany(
    { _id: { $in: userIds } },
    {
      $addToSet: {
        structures: structureId
      }
    }
  );

export const removeStructureOfAllUsersInDB = (structureId: StructureId) =>
  UserModel.updateMany(
    { structures: structureId },
    {
      $pull: {
        structures: structureId
      }
    }
  );

export const removeStructureOfUserInDB = (userId: UserId, structureId: StructureId) =>
  UserModel.updateOne(
    { _id: userId },
    {
      $pull: {
        structures: structureId
      }
    }
  );

export const getUserByUsernameFromDB = (username: string) => UserModel.findOne({ username });

export const createUser = (user: {
  username: string;
  password: string;
  roles: Types.ObjectId[];
  status: string;
  last_connected: Date;
}): Promise<User> => UserModel.create(user);

export const addRoleAndContribToUser = (userId: Types.ObjectId, roleId: Types.ObjectId, contribId: Types.ObjectId) =>
  UserModel.findByIdAndUpdate(
    { _id: userId },
    {
      $addToSet: { roles: roleId, contributions: contribId }
    },
    { new: true }
  );
