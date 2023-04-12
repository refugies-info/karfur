import { Types } from "mongoose";
import { User } from "../../../typegoose";
import { addLog, optionsType } from "../../../modules/logs/logs.service";
import { Id, UpdateUserRequest } from "@refugies-info/api-types";

export const log = async (id: Id, user: UpdateUserRequest["user"], userFromDb: User, authorId: Types.ObjectId) => {
  const logOptions: optionsType = {
    author: authorId,
    link: {
      id: authorId,
      model_link: "User",
      next: "ModalUser",
    },
  };

  if (userFromDb.phone && user.phone !== userFromDb.phone) {
    await addLog(id, "User", "Modification du numéro de téléphone", logOptions);
  }
  if (user.phone && !userFromDb.phone) {
    await addLog(id, "User", "Ajout du numéro de téléphone", logOptions);
  }
  if (!userFromDb.email && user.email) {
    await addLog(id, "User", "Ajout de l’adresse mail", logOptions);
  }
  if (userFromDb.email && user.email !== userFromDb.email) {
    await addLog(id, "User", "Modification de l’adresse mail", logOptions);
  }
  if (user.username !== userFromDb.username) {
    await addLog(id, "User", "Modification du pseudo par", logOptions);
  }
};
