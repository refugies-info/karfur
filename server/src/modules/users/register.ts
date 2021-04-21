import logger from "../../logger";
import { computePasswordStrengthScore } from "../../libs/computePasswordStrengthScore";
import passwordHash from "password-hash";
import { createUser } from "./users.repository";
import { ObjectId } from "mongoose";
import { sendWelcomeMail } from "../mail/mail.service";

export const register = async (
  user: { username: string; password: string; email?: string },
  userRole: { nom: string; _id: ObjectId }
) => {
  try {
    logger.info("[Register] register attempt", { username: user.username });
    if ((computePasswordStrengthScore(user.password) || {}).score < 1) {
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
      email: user.email,
    };
    const savedUser = await createUser(userToSave);

    if (savedUser.email) {
      await sendWelcomeMail(savedUser.email, savedUser.username, savedUser._id);
    }

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

    if (error.message === "PASSWORD_TOO_WEAK") {
      throw new Error("PASSWORD_TOO_WEAK");
    }
    throw new Error("INTERNAL");
  }
};
