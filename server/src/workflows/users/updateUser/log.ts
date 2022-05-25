import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";
import { UserDoc } from "../../../schema/schemaUser";
import { User } from "./updateUser";

export const log = async (
  user: User,
  userFromDb: UserDoc,
  authorId: ObjectId
) => {
  if (userFromDb.phone && user.phone !== userFromDb.phone) {
    await addLog(
      user._id,
      "User",
      "Modification du numéro de téléphone",
      { author: authorId }
    );
  }
  if (user.phone && !userFromDb.phone) {
    await addLog(
      user._id,
      "User",
      "Ajout du numéro de téléphone",
      { author: authorId }
    );
  }
  if (!userFromDb.email && user.email) {
    await addLog(
      user._id,
      "User",
      "Ajout de l’adresse mail",
      { author: authorId }
    );
  }
  if (userFromDb.email && user.email !== userFromDb.email) {
    await addLog(
      user._id,
      "User",
      "Modification de l’adresse mail",
      { author: authorId }
    );
  }
  if (user.username !== userFromDb.username) {
    await addLog(
      user._id,
      "User",
      "Modification du pseudo par",
      { author: authorId }
    );
  }
}
