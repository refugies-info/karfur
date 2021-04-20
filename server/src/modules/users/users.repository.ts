import { User } from "../../schema/schemaUser";
import { ObjectId } from "mongoose";

type NeededFields =
  | { username: number; picture: number }
  | { roles: 1; structures: 1 }
  | { roles: 1 }
  | {};

export const getUserById = async (id: ObjectId, neededFields: NeededFields) =>
  await User.findOne({ _id: id }, neededFields);

export const getAllUsersFromDB = async (neededFields: Record<string, number>) =>
  await User.find({ status: "Actif" }, neededFields).populate(
    "roles structures"
  );

export const updateUserInDB = async (id: ObjectId, modifiedUser: any) =>
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

export const getUserByUsernameFromDB = async (username: string) =>
  await User.findOne({ username });

export const createUser = async (user: {
  username: string;
  password: string;
  roles: ObjectId[];
  status: string;
  last_connected: Date;
  // @ts-ignore
}) => await User.create(user);

export const addRoleAndContribToUser = (
  userId: ObjectId,
  roleId: ObjectId,
  contribId: ObjectId
) =>
  User.findByIdAndUpdate(
    { _id: userId },
    {
      $addToSet: { roles: roleId, contributions: contribId },
    },
    // @ts-ignore
    { new: true }
  );
