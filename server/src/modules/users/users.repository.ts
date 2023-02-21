import { FilterQuery, Types } from "mongoose";
import { Id } from "../../types/interface";
import { LangueId, StructureId, User, UserModel } from "../../typegoose";
import { Favorite, UserId, UserStatus } from "../../typegoose/User";

type NeededFields = { username: number; picture: number } | { roles: 1; structures: 1 } | { roles: 1 } | {};

export const getUserById = async (id: UserId, neededFields: NeededFields) => UserModel.findById(id, neededFields);

export const getUsersById = async (ids: UserId[], neededFields: NeededFields) =>
  UserModel.find({ _id: { $in: ids } }, neededFields);

export const findUsers = (filter: FilterQuery<User>, neededFields: Record<string, number> = {}) =>
  UserModel.find(filter, neededFields);

export const getAllUsersFromDB = async (neededFields: FilterQuery<User>) =>
  UserModel.find({ status: UserStatus.USER_STATUS_ACTIVE }, neededFields)

export const getAllUsersForAdminFromDB = async (neededFields: FilterQuery<User>) =>
  UserModel.find({ status: UserStatus.USER_STATUS_ACTIVE }, neededFields).populate<{
    selectedLanguages: { langueCode: string, langueFr: string }[]
  }>([
    { path: "selectedLanguages", select: "langueCode langueFr" },
    { path: "roles" },
    { path: "structures" }
  ]);

export const updateUserInDB = async (id: UserId, modifiedUser: any) =>
  UserModel.findOneAndUpdate({ _id: id }, modifiedUser, {
    upsert: true,
    new: true,
  });

export const saveSelectedLanguages = (id: UserId, selectedLanguages: LangueId[]) =>
  UserModel.findByIdAndUpdate(id, { $set: { selectedLanguages } });

export const addStructureForUsersInDB = (userIds: UserId[], structureId: StructureId) =>
  UserModel.updateMany(
    { _id: { $in: userIds } },
    {
      $addToSet: {
        structures: structureId,
      },
    },
  );

export const removeStructureOfAllUsersInDB = (structureId: StructureId) =>
  UserModel.updateMany(
    { structures: structureId },
    {
      $pull: {
        structures: structureId,
      },
    },
  );

export const removeStructureOfUserInDB = (userId: UserId, structureId: StructureId) =>
  UserModel.updateOne(
    { _id: userId },
    {
      $pull: {
        structures: structureId,
      },
    },
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
      $addToSet: { roles: roleId, contributions: contribId },
    },
    { new: true },
  );

// Favorites
export const addFavoriteInDB = (userId: UserId, favorite: Favorite) =>
  UserModel.updateOne(
    { _id: userId },
    {
      $addToSet: {
        favorites: favorite,
      },
    },
  );

export const removeFavoriteFromDB = (userId: UserId, dispositifId: Id) =>
  UserModel.updateOne(
    { _id: userId },
    {
      $pull: { favorites: { dispositifId: dispositifId } }
    },
  );
