import { UserStatus } from "@refugies-info/api-types";
import { DocumentType } from "@typegoose/typegoose";
import { AuthenticationError, InternalError, InvalidRequestError, NotFoundError, UnauthorizedError } from "~/errors";
import logger from "~/logger";
import { User } from "~/typegoose";
import { addLog } from "../logs/logs.service";
import { userRespoStructureId } from "../structure/structure.service";
import LoginError, { LoginErrorType } from "./LoginError";
import { getUserByEmailFromDB } from "./users.repository";
import { updateLastConnected } from "./users.service";

export const loginExceptionsManager = (error: LoginError) => {
  logger.error("[Login] error while login", { error: error.message });
  switch (error.message) {
    case LoginErrorType.INVALID_REQUEST:
      throw new InvalidRequestError("Requête invalide");
    case LoginErrorType.INVALID_PASSWORD:
      throw new UnauthorizedError("Mot de passe incorrect", "INVALID_PASSWORD");
    case LoginErrorType.USED_PASSWORD:
      throw new InvalidRequestError(
        "Le mot de passe ne peut pas être identique à l'ancien mot de passe.",
        "USED_PASSWORD",
      );
    case LoginErrorType.PASSWORD_TOO_WEAK:
      throw new InvalidRequestError("Le mot de passe est trop faible");
    case LoginErrorType.WRONG_CODE:
      throw new AuthenticationError("Erreur à la vérification du code", "WRONG_CODE");
    case LoginErrorType.SSO_URL:
      throw new AuthenticationError(
        "Veuillez compléter l'authentification en suivant l'url associée.",
        "SSO_URL",
        error.data,
      );
    case LoginErrorType.ERROR_WHILE_SENDING_CODE:
      throw new InternalError("Erreur à l'envoi du code à ce numéro", "ERROR_WHILE_SENDING_CODE");
    case LoginErrorType.NO_CONTACT:
      throw new InvalidRequestError("No contact informations", "NO_CONTACT", error.data);
    case LoginErrorType.NO_CODE_SUPPLIED:
      throw new InvalidRequestError("No code supplied", "NO_CODE_SUPPLIED", error.data);
    case LoginErrorType.USER_DELETED:
      throw new NotFoundError("Utilisateur supprimé", "USER_DELETED", error.data);
    case LoginErrorType.NO_EMAIL:
      throw new AuthenticationError(
        "Aucune adresse mail n'est associée à ce compte. Il n'est pas possible de récupérer le mot de passe ainsi.",
        "NO_EMAIL",
      ); // 401
    case LoginErrorType.NO_ACCOUNT:
      throw new NotFoundError("Pas de compte associé à cet email.", "NO_ACCOUNT", error.data);
    case LoginErrorType.USER_NOT_EXISTS:
      throw new NotFoundError("Utilisateur inconnu.", "USER_NOT_EXISTS");
    case LoginErrorType.SSO_NO_PASSWORD:
      throw new NotFoundError("Connexion avec un mot de passe impossible, compte créé par SSO.", "SSO_NO_PASSWORD");
    default:
      throw new InternalError("Erreur interne.");
  }
};

export const isUserValid = async (user: DocumentType<User> | null | undefined, email: string): Promise<boolean> => {
  if (!user) throw new LoginError(LoginErrorType.NO_ACCOUNT, { email });
  if (user.status === UserStatus.DELETED) throw new LoginError(LoginErrorType.USER_DELETED);
  return true;
};

/**
 * Log all data before login and return token
 * @param user
 */
export const logUser = async (user: DocumentType<User> | string): Promise<string> => {
  let userDocument: DocumentType<User> = typeof user === "string" ? await getUserByEmailFromDB(user) : user;
  await isUserValid(userDocument, userDocument.email);
  await updateLastConnected(userDocument);
  await addLog(userDocument._id, "User", "Connexion");
  return userDocument.getToken();
};

/**
 * Check if user needs two-factor authentication
 * @param user - user object or email
 */
export const needs2FA = async (user: DocumentType<User> | string): Promise<boolean> => {
  const userDocument: DocumentType<User> =
    typeof user === "string" ? await getUserByEmailFromDB(user).populate("roles") : user;
  if (!userDocument) return false;
  const userIsAdmin = userDocument.isAdmin();
  const userIsExpertTrad = userDocument.isExpert();
  const userStructureId = await userRespoStructureId(userDocument.structures.map((s) => s._id) || [], userDocument._id);
  return !!(userIsAdmin || userStructureId || userIsExpertTrad);
};

/**
 * Has logged in before 2fa
 * @param mfaCode
 */
export const isMfaCodeOk = async (mfaCode: string | undefined, email: string): Promise<boolean> => {
  if (!mfaCode) return false;
  const user: DocumentType<User> = await getUserByEmailFromDB(email);
  if (!user) return false;
  return user.mfaCode === mfaCode;
};
