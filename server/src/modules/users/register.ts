import logger from "../../logger";
// @ts-ignore
import passwdCheck from "zxcvbn";
// @ts-ignore
import passwordHash from "password-hash";
import { createUser } from "./users.repository";
import { ObjectId } from "mongoose";

export const register = async (
  user: { username: string; password: string },
  userRole: { nom: string; _id: ObjectId }
) => {
  try {
    logger.info("[Register] register attempt", { username: user.username });

    if ((passwdCheck(user.password) || {}).score < 1) {
      logger.error("[Register] register failed, password too weak", {
        username: user.username,
      });
      throw new Error("PASSWORD_TOO_WEAK");
    }
    const hashedPassword = passwordHash.generate(user.password);

    const roles = [userRole._id];

    const userToSave = {
      username: user.username,
      password: hashedPassword,
      roles,
      status: "Actif",
      last_connected: new Date(),
    };
    const savedUser = await createUser(userToSave);

    logger.info("[Register] successfully registered a new user", {
      username: user.username,
    });

    // @ts-ignore
    return { user: savedUser, token: savedUser.getToken() };
  } catch (error) {
    logger.error("[Register] register failed, unexpected error", {
      username: user.username,
      error: error.message,
    });
    throw new Error("INTERNAL");
  }
};
