import { Id, UserStatus } from "@refugies-info/api-types";
import { FilterQuery, Types } from "mongoose";
import { LangueId, ObjectId, Role, Structure, StructureId, User, UserModel } from "~/typegoose";
import { Favorite, UserId } from "~/typegoose/User";

type NeededFields = { username: number; picture: number } | { roles: 1; structures: 1 } | { roles: 1 } | {};

// find one
export const getUserById = async (id: Id, neededFields: NeededFields) => UserModel.findById(id, neededFields);

export const getUserByIdWithStructures = async (id: Id, neededFields: NeededFields) =>
  UserModel.findById(id, neededFields).populate<{ structures: { nom: string }[] }>([
    { path: "structures", select: "nom" },
  ]);

export const getUserByEmailFromDB = (email: string) => UserModel.findOne({ email });

export const getUserFromDB = (query: FilterQuery<User>) => UserModel.findOne(query);

export const getUserName = async (id: Id) =>
  UserModel.findById(id, { username: 1, email: 1 }).then((res) => res?.username || res?.email);

// find many
export const getUsersById = async (ids: UserId[], neededFields: NeededFields) =>
  UserModel.find({ _id: { $in: ids } }, neededFields).lean();

export const findUsers = (filter: FilterQuery<User>, neededFields: Record<string, number> = {}) =>
  UserModel.find(filter, neededFields);

export const getAllUsersFromDB = async (neededFields: FilterQuery<User>, populate: string = "") =>
  UserModel.find({ status: UserStatus.ACTIVE }, neededFields).populate(populate);

export const getAllUsersForAdminFromDB = async (neededFields: FilterQuery<User>) =>
  UserModel.find({ status: UserStatus.ACTIVE }, neededFields).populate<{
    selectedLanguages: { langueCode: string; langueFr: string; _id: LangueId }[];
    roles: Role[];
    structures: (Structure & { _id: Id })[];
  }>([
    { path: "selectedLanguages", select: "_id langueCode langueFr" },
    { path: "roles", select: "nom nomPublique" },
    { path: "structures" },
    { path: "departments" },
  ]);

// update
export const updateUserInDB = async (
  id: Id,
  modifiedUser: Partial<User>, // FIXME in updateUser
) =>
  UserModel.findOneAndUpdate({ _id: id }, modifiedUser, {
    upsert: true,
    new: true,
  });

export const saveSelectedLanguages = (id: UserId, selectedLanguages: Id[]) =>
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

export const createUser = (user: {
  firstName: string;
  password: string;
  roles: Types.ObjectId[];
  status: string;
  last_connected: Date;
}) => UserModel.create(user);

export const addRoleAndContribToUser = (userId: Id, roleId: Types.ObjectId, contribId: Types.ObjectId) =>
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
    { _id: new ObjectId(userId.toString()) },
    {
      $pull: { favorites: { dispositifId: new ObjectId(dispositifId.toString()) } },
    },
  );
