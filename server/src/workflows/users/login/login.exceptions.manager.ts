import logger from "../../../logger";
import { Res } from "../../../types/interface";
import LoginError from "../../../modules/users/LoginError";

export const loginExceptionsManager = (error: LoginError, res: Res) => {
  logger.error("[Login] error while login", { error: error.message });
  switch (error.message) {
    case "INVALID_REQUEST":
      return res.status(400).json({ text: "Requête invalide" });
    case "INVALID_PASSWORD":
      return res
        .status(401)
        .json({ text: "Mot de passe incorrect", data: "no-alert" });
    case "USED_PASSWORD":
      return res.status(400).json({
        code: "USED_PASSWORD",
        text: "Le mot de passe ne peut pas être identique à l'ancien mot de passe.",
        data: "no-alert"
      });
    case "NOT_FROM_SITE":
      return res
        .status(403)
        .json({ text: "Création d'utilisateur ou login impossible par API" });
    case "PASSWORD_TOO_WEAK":
      return res.status(401).json({ text: "Le mot de passe est trop faible" });
    case "INTERNAL":
      return res.status(500).json({ text: "Erreur interne" });
    case "WRONG_CODE":
      return res.status(402).json({
        text: "Erreur à la vérification du code",
        data: "no-alert",
      });
    case "ERROR_WHILE_SENDING_ADMIN_CODE":
      return res.status(404).json({
        text: "Erreur à l'envoi du code à ce numéro",
      });
    case "NO_CONTACT":
      return res.status(502).json({
        text: "no contact informations",
        ...error.data
      });
    case "NO_CODE_SUPPLIED":
      return res.status(501).json({
        text: "no code supplied",
        ...error.data
      });
    case "USER_DELETED":
      return res.status(405).json({
        text: "Utilisateur supprimé",
      });
    case "ADMIN_FORBIDDEN":
      return res.status(401).json({ text: "Cet utilisateur n'est pas autorisé à modifier son mot de passe ainsi, merci de contacter l'administrateur du site" });
    case "NO_EMAIL":
      return res.status(403).json({ text: "Aucune adresse mail n'est associée à ce compte. Il n'est pas possible de récupérer le mot de passe ainsi." });
    case "USER_NOT_EXISTS":
      return res.status(500).json({ text: "Utilisateur inconnu" });
    default:
      res.status(500).json({
        text: "Erreur interne",
      });
  }
};
