import { Types } from "mongoose";
import { User } from "src/typegoose";
import { addLog, optionsType } from "../../../modules/logs/logs.service";
import { User as UserUpdate } from "./updateUser";

export const log = async (user: UserUpdate, userFromDb: User, authorId: Types.ObjectId) => {
  const logOptions: optionsType = {
    author: authorId,
    link: {
      id: authorId,
      model_link: "User",
      next: "ModalUser"
    }
  };

  if (userFromDb.phone && user.phone !== userFromDb.phone) {
    await addLog(user._id, "User", "Modification du numéro de téléphone", logOptions);
  }
  if (user.phone && !userFromDb.phone) {
    await addLog(user._id, "User", "Ajout du numéro de téléphone", logOptions);
  }
  if (!userFromDb.email && user.email) {
    await addLog(user._id, "User", "Ajout de l’adresse mail", logOptions);
  }
  if (userFromDb.email && user.email !== userFromDb.email) {
    await addLog(user._id, "User", "Modification de l’adresse mail", logOptions);
  }
  if (user.username !== userFromDb.username) {
    await addLog(user._id, "User", "Modification du pseudo par", logOptions);
  }
};
