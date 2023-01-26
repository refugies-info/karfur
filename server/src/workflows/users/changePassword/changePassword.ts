import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { ObjectId } from "mongoose";
import { celebrate, Joi, Segments } from "celebrate";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import logger from "../../../logger";
import {
  getUserById,
  updateUserInDB,
} from "../../../modules/users/users.repository";
import { isPasswordOk } from "../../../libs/validatePassword";
import passwordHash from "password-hash";
import { USER_STATUS_DELETED } from "../../../schema/schemaUser";

const validator = celebrate({
  [Segments.BODY]: Joi.object({
    userId: Joi.string(),
    currentPassword: Joi.string(),
    newPassword: Joi.string()
  })
});


interface Query {
  userId: ObjectId;
  currentPassword: string;
  newPassword: string;
}
const handler = async (
  req: RequestFromClientWithBody<Query>,
  res: Res
) => {
  try {
    logger.info("[changePassword] received");
    checkRequestIsFromSite(req.fromSite);

    const { userId, currentPassword, newPassword } = req.body;
    if (userId.toString() !== req.userId.toString()) {
      throw new Error("INVALID_TOKEN");
    }

    const user = await getUserById(userId, {});

    if (!user || user.status === USER_STATUS_DELETED) {
      throw new Error("USER_NOT_EXISTS");
    }

    // @ts-ignore
    if (!user.authenticate(currentPassword)) {
      throw new Error("INVALID_PASSWORD");
    }

    if (newPassword === currentPassword) {
      throw new Error("USED_PASSWORD");
    }

    if (!isPasswordOk(newPassword)) {
      throw new Error("NEW_PASSWORD_TOO_WEAK");
    }

    const newPasswordHashed = passwordHash.generate(newPassword);

    const updatedUser = await updateUserInDB(userId, {
      password: newPasswordHashed,
    });

    return res.status(200).json({
      // @ts-ignore
      token: updatedUser.getToken(),
      text: "Authentification réussi",
    });
  } catch (error) {
    logger.error("[changePassword] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "INVALID_TOKEN":
        return res.status(401).json({ text: "Token invalide" });
      case "USER_NOT_EXISTS":
        return res.status(500).json({ text: "Utilisateur inconnu" });
      case "NEW_PASSWORD_TOO_WEAK":
        return res
          .status(401)
          .json({ text: "Le mot de passe est trop faible" });
      case "USED_PASSWORD":
        return res.status(400).json({
          code: "USED_PASSWORD",
          text: "Le mot de passe ne peut pas être identique à l'ancien mot de passe.",
          data: "no-alert"
        });
      case "INVALID_PASSWORD":
        return res.status(401).json({ text: "Mot de passe incorrect" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, handler];
