import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";

export const logRegister = async (
  userId: ObjectId
) => {
  await addLog(
    userId,
    "User",
    "Utilisateur créé : première connexion",
  );
}
export const logLogin = async (
  userId: ObjectId
) => {
  await addLog(
    userId,
    "User",
    "Connexion",
  );
}
