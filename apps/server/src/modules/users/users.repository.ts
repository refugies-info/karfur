import { type Id, UserStatus } from "@refugies-info/api-types";
import type { Favorite, UserId } from "@refugies-info/mongo";
import {
  type LangueId,
  ObjectId,
  type Role,
  type Structure,
  type StructureId,
  type User,
  UserModel,
} from "@refugies-info/mongo";
import type { FilterQuery, ProjectionType, Types } from "mongoose";

// find one
export const getUserById = async (id: Id, neededFields: ProjectionType<User>) =>
  UserModel.findById(id, neededFields);

export const getUserByIdWithStructures = async (id: Id, neededFields: ProjectionType<User>) =>
  UserModel.findById(id, neededFields).populate<{ structures: { nom: string }[] }>([
    { path: "structures", select: "nom" },
  ]);

export const getUserByEmailFromDB = (email: string) => UserModel.findOne({ email });

export const getUserFromDB = (query: FilterQuery<User>) => UserModel.findOne(query);

export const getUserName = async (id: Id) =>
  UserModel.findById(id, { username: 1, email: 1 }).then((res) => res?.username || res?.email);

// find many
export const getUsersById = async <T = User>(ids: UserId[], neededFields: ProjectionType<User>) =>
  UserModel.find({ _id: { $in: ids } }, neededFields).lean() as unknown as Promise<T[]>;

export const findUsers = (filter: FilterQuery<User>, neededFields: Record<string, number> = {}) =>
  UserModel.find(filter, neededFields);

export const getAllUsersFromDB = async (neededFields: FilterQuery<User>, populate: string = "") =>
  UserModel.find({ status: UserStatus.ACTIVE }, neededFields).populate(populate);

/**
 * User type with populated structures field
 * Used when structures are populated from the database
 */
export type UserWithPopulatedStructures = Omit<
  User,
  "structures" | "selectedLanguages" | "roles"
> & {
  structures: Structure[];
  selectedLanguages: { langueCode: string; langueFr: string; _id: LangueId }[];
  roles: Role[];
};

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
  ]) as unknown as Promise<UserWithPopulatedStructures[]>;

/**
 * Lightweight user query for translation statistics.
 * Only populates roles + selectedLanguages (no structures/departments).
 * Cached via speedgoose to avoid repeated full table scans.
 */
export const getUsersForTranslationStats = () =>
  UserModel.find(
    { status: UserStatus.ACTIVE },
    { roles: 1, last_connected: 1, selectedLanguages: 1 },
  )
    .populate([
      { path: "roles", select: "nom" },
      { path: "selectedLanguages", select: "_id" },
    ])
    .lean()
    .cacheQuery() as unknown as Promise<
    { roles: { nom: string }[]; last_connected: Date; selectedLanguages: { _id: LangueId }[] }[]
  >;

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

export const addRoleAndContribToUser = (
  userId: Id,
  roleId: Types.ObjectId,
  contribId: Types.ObjectId,
) =>
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
