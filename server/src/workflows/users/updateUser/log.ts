import { ObjectId } from "mongoose";
import { addLog, optionsType } from "../../../modules/logs/logs.service";
import { UserDoc } from "../../../schema/schemaUser";
import { User } from "./updateUser";

export const log = async (
  user: User,
  userFromDb: UserDoc,
  authorId: ObjectId
) => {
  const logOptions: optionsType = {
    author: authorId,
    link: {
      id: authorId,
      model_link: "User",
      next: "ModalUser"
    },
  }

  if (userFromDb.phone && user.phone !== userFromDb.phone) {
    await addLog(
      user._id,
      "User",
      "Modification du numéro de téléphone",
      logOptions
    );
  }
  if (user.phone && !userFromDb.phone) {
    await addLog(
      user._id,
      "User",
      "Ajout du numéro de téléphone",
      logOptions
    );
  }
  if (!userFromDb.email && user.email) {
    await addLog(
      user._id,
      "User",
      "Ajout de l’adresse mail",
      logOptions
    );
  }
  if (userFromDb.email && user.email !== userFromDb.email) {
    await addLog(
      user._id,
      "User",
      "Modification de l’adresse mail",
      logOptions
    );
  }
  if (user.username !== userFromDb.username) {
    await addLog(
      user._id,
      "User",
      "Modification du pseudo par",
      logOptions
    );
  }
}
