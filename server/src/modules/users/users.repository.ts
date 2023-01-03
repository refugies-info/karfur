import { User, UserDoc, USER_STATUS_ACTIVE } from "../../schema/schemaUser";
import { FilterQuery, ObjectId } from "mongoose";

type NeededFields = { username: number; picture: number } | { roles: 1; structures: 1 } | { roles: 1 } | {};

export const getUserById = async (id: ObjectId, neededFields: NeededFields) =>
  await User.findOne({ _id: id }, neededFields);

export const getUsersById = async (ids: ObjectId[], neededFields: NeededFields) =>
  await User.find({ _id: { $in: ids } }, neededFields);

export const findUsers = (filter: FilterQuery<UserDoc>, neededFields: Record<string, number> = {}) =>
  User.find(filter, neededFields);

export const getAllUsersFromDB = async (neededFields: Record<string, number>, populate: string = "roles structures") =>
  await User.find({ status: USER_STATUS_ACTIVE }, neededFields).populate(populate);

export const updateUserInDB = async (id: ObjectId, modifiedUser: any) =>
  await User.findOneAndUpdate({ _id: id }, modifiedUser, {
    upsert: true,
    // @ts-ignore
    new: true
  });

export const removeRoleAndStructureInDB = (roleId: ObjectId, userId: ObjectId, structureId: ObjectId) =>
  User.findByIdAndUpdate(
    { _id: userId },
    {
      $pull: {
        roles: roleId,
        structures: structureId
      }
    },
    { upsert: true }
  );

export const removeStructureInDB = (userId: ObjectId, structureId: ObjectId) =>
  User.findByIdAndUpdate(
    { _id: userId },
    {
      $pull: {
        structures: structureId
      }
    },
    { upsert: true }
  );

export const getUserByUsernameFromDB = async (username: string) => await User.findOne({ username });

export const createUser = async (user: {
  username: string;
  password: string;
  roles: ObjectId[];
  status: string;
  last_connected: Date;
  // @ts-ignore
}) => await User.create(user);

export const addRoleAndContribToUser = (userId: ObjectId, roleId: ObjectId, contribId: ObjectId) =>
  User.findByIdAndUpdate(
    { _id: userId },
    {
      $addToSet: { roles: roleId, contributions: contribId }
    },
    // @ts-ignore
    { new: true }
  );
