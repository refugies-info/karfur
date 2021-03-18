import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { ObjectId } from "mongoose";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import logger from "../../../logger";
import {
  getUserById,
  updateUserInDB,
} from "../../../modules/users/users.repository";
import { computePasswordStrengthScore } from "../../../libs/computePasswordStrengthScore";
import passwordHash from "password-hash";

interface Query {
  userId: ObjectId;
  currentPassword: string;
  newPassword: string;
}
export const changePassword = async (
  req: RequestFromClientWithBody<Query>,
  res: Res
) => {
  try {
    logger.info("[changePassword] received");
    checkRequestIsFromSite(req.fromSite);

    if (
      !req.body.userId ||
      !req.body.currentPassword ||
      !req.body.newPassword
    ) {
      throw new Error("INVALID_REQUEST");
    }
    const { userId, currentPassword, newPassword } = req.body;
    if (userId.toString() !== req.userId.toString()) {
      throw new Error("INVALID_TOKEN");
    }

    const user = await getUserById(userId, {});

    if (!user) {
      throw new Error("USER_NOT_EXISTS");
    }

    // @ts-ignore
    if (!user.authenticate(currentPassword)) {
      throw new Error("INVALID_PASSWORD");
    }

    if (computePasswordStrengthScore(newPassword).score < 1) {
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
      case "INVALID_PASSWORD":
        return res.status(401).json({ text: "Mot de passe incorrect" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
