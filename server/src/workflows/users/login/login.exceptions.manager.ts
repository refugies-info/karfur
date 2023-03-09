import {
  UnauthorizedError,
  AuthenticationError,
  NotFoundError,
  InvalidRequestError,
  InternalError,
} from "../../../errors";
import logger from "../../../logger";
import LoginError from "../../../modules/users/LoginError";

export const loginExceptionsManager = (error: LoginError) => {
  logger.error("[Login] error while login", { error: error.message });
  switch (error.message) {
    case "INVALID_REQUEST":
      throw new InvalidRequestError("Requête invalide");
    case "INVALID_PASSWORD":
      throw new UnauthorizedError("Mot de passe incorrect", "INVALID_PASSWORD");
    case "USED_PASSWORD":
      throw new InvalidRequestError("Requête invalide", "USED_PASSWORD");
    case "PASSWORD_TOO_WEAK":
      throw new InvalidRequestError("Le mot de passe est trop faible");
    case "WRONG_CODE":
      throw new AuthenticationError("Erreur à la vérification du code", "WRONG_CODE");
    case "ERROR_WHILE_SENDING_ADMIN_CODE":
      throw new InternalError("Erreur à l'envoi du code à ce numéro", "ERROR_WHILE_SENDING_ADMIN_CODE");
    case "NO_CONTACT":
      throw new InvalidRequestError("No contact informations", "NO_CONTACT", error.data);
    case "NO_CODE_SUPPLIED":
      throw new InvalidRequestError("No code supplied", "NO_CODE_SUPPLIED", error.data);
    case "USER_DELETED":
      throw new NotFoundError("Utilisateur supprimé", "USER_DELETED", error.data);
    case "ADMIN_FORBIDDEN":
      throw new AuthenticationError("Cet utilisateur n'est pas autorisé à modifier son mot de passe ainsi, merci de contacter l'administrateur du site", "ADMIN_FORBIDDEN"); // 401
    case "NO_EMAIL":
      throw new AuthenticationError("Aucune adresse mail n'est associée à ce compte. Il n'est pas possible de récupérer le mot de passe ainsi.", "NO_EMAIL"); // 401
    case "USER_NOT_EXISTS":
      throw new NotFoundError("Utilisateur inconnu.", "USER_NOT_EXISTS");
    default:
      throw new InternalError("Erreur interne.");
  }
};
