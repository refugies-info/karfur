import logger from "../../logger";
import { UserDoc } from "../../schema/schemaUser";
import { updateUserInDB } from "./users.repository";
import { proceedWithLogin } from "./users.service";
import { Res } from "../../types/interface";
import { loginExceptionsManager } from "../../workflows/users/login/login.exceptions.manager";
const authy = require("authy")(process.env.ACCOUNT_SECURITY_API_KEY);

const requestSMSAdminLogin = async (
  authyId: string,
  username: string,
  res: Res
) => {
  authy.request_sms(authyId, true, function (err_sms: Error) {
    if (err_sms) {
      logger.error("[Login] error while sending sms for admin", {
        username,
        error: err_sms,
      });
      return loginExceptionsManager(
        new Error("ERROR_WHILE_SENDING_ADMIN_CODE"),
        res
      );
    }

    logger.info("[Login] admin, sms successfully sent to user", {
      username,
    });
    return loginExceptionsManager(new Error("NO_CODE_SUPPLIED"), res);
  });
};

export const adminLogin = async (
  userFromRequest: {
    username: string;
    password: string;
    code?: string;
    email?: string;
    phone?: string;
  },
  userFromDB: UserDoc,
  res: Res
) => {
  const username = userFromRequest.username;
  logger.info("[Login] admin user", {
    username,
  });

  // user already authy_id and code provided --> check code
  if (userFromDB.authy_id && userFromRequest.code) {
    logger.info("[Login] admin user with a code provided", {
      username,
    });

    // code provided : check if code is correct
    return authy.verify(userFromDB.authy_id, userFromRequest.code, function (
      err: Error,
      result: any
    ) {
      if (err || !result) {
        logger.error("[Login] error while verifying admin code", {
          username,
        });
        return loginExceptionsManager(new Error("WRONG_ADMIN_CODE"), res);
      }

      logger.info("[Login] admin user, code provided is correct", {
        username,
      });
      proceedWithLogin(userFromDB);
      return res.status(200).json({
        // @ts-ignore
        token: userFromDB.getToken(),
        text: "Authentification réussi",
      });
    });
  }

  // user already authy_id and no code provided --> send sms
  if (userFromDB.authy_id) {
    logger.info("[Login] admin user without a code provided", {
      username,
    });

    // no code provided : send sms with code
    return requestSMSAdminLogin(userFromDB.authy_id, username, res);
  }

  // user not already admin
  if (userFromRequest.email && userFromRequest.phone) {
    logger.info("[Login] new admin user", {
      username,
    });
    // creation of admin user
    return authy.register_user(
      userFromRequest.email,
      userFromRequest.phone,
      "33",
      function (err: Error, result: { user: { id: string } }) {
        if (err) {
          logger.error(
            "[Login] error while creating a new admin account for user",
            { username }
          );
          return loginExceptionsManager(
            new Error("ERROR_AUTHY_ACCOUNT_CREATION"),
            res
          );
        }
        const authyId = result.user.id;
        updateUserInDB(userFromDB._id, {
          authy_id: authyId,
          phone: userFromRequest.phone,
          email: userFromRequest.email,
        });
        return requestSMSAdminLogin(authyId, username, res);
      }
    );
  }

  throw new Error("NO_AUTHY_ID");
};
