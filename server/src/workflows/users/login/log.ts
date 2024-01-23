import { Types } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";

export const logRegister = async (userId: Types.ObjectId) => {
  await addLog(userId, "User", "Utilisateur créé : première connexion");
};
