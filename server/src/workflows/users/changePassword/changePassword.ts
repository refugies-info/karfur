import passwordHash from "password-hash";
import logger from "../../../logger";
import { getUserById, updateUserInDB } from "../../../modules/users/users.repository";
import { isPasswordOk } from "../../../libs/validatePassword";
import { User } from "../../../typegoose/User";
import { InvalidRequestError, UnauthorizedError } from "../../../errors";
import { ResponseWithData } from "../../../types/interface";
import { UpdatePasswordRequest, UpdatePasswordResponse, UserStatus } from "api-types";



export const changePassword = async (id: string, body: UpdatePasswordRequest, userReq: User): ResponseWithData<UpdatePasswordResponse> => {
  logger.info("[changePassword] received");

  const { currentPassword, newPassword } = body;
  if (id !== userReq._id.toString()) {
    throw new UnauthorizedError("Token invalide");
  }

  const user = await getUserById(id, {});

  if (!user || user.status === UserStatus.DELETED) {
    throw new Error("Utilisateur inconnu");
  }

  if (!user.authenticate(currentPassword)) {
    throw new UnauthorizedError("Mot de passe incorrect");
  }

  if (newPassword === currentPassword) {
    throw new InvalidRequestError("Le mot de passe ne peut pas être identique à l'ancien mot de passe.", "USED_PASSWORD");
  }

  if (!isPasswordOk(newPassword)) {
    throw new UnauthorizedError("Le mot de passe est trop faible");
  }

  const newPasswordHashed = passwordHash.generate(newPassword);

  const updatedUser = await updateUserInDB(id, {
    password: newPasswordHashed,
  });

  return {
    text: "success",
    data: { token: updatedUser.getToken() },
  };
};
