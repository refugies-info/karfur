import logger from "../../logger";
import { UserDoc } from "../../schema/schemaUser";
import { updateUserInDB } from "./users.repository";
import { proceedWithLogin } from "./users.service";
import { Res } from "../../types/interface";
import { loginExceptionsManager } from "../../workflows/users/login/login.exceptions.manager";
const { accountSid, authToken } = process.env;
const client = require("twilio")(accountSid, authToken);
const twilioService = client.verify.services.create({ friendlyName: "Réfugiés.info" });

const requestSMSAdminLogin = async (
  phone: string,
  service: any,
  res: Res
) => {
  try {
    await client.verify.services(service.sid)
      .verifications
      .create({ to: `+33${phone}`, channel: "sms" })
    } catch (e) {
      logger.error("[Login] error while sending sms for admin", {
        phone,
        error: e,
      });
      return loginExceptionsManager(
        new Error("ERROR_WHILE_SENDING_ADMIN_CODE"),
        res
      );
    }
    logger.info("[Login] admin, sms successfully sent to user", {
      phone,
    });
    return loginExceptionsManager(new Error("NO_CODE_SUPPLIED"), res);
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

  const service = await twilioService;

  // code provided --> check code
  const phone = userFromDB.phone || userFromRequest.phone;
  if (phone && userFromRequest.code) {
    logger.info("[Login] admin user with a code provided", {
      username,
    });

    const check = await client.verify.services(service.sid)
      .verificationChecks
      .create({to: `+33${phone}`, code: userFromRequest.code})

    if (check.status !== "approved") {
      logger.error("[Login] error while verifying admin code", {
        username,
      });
      return loginExceptionsManager(new Error("WRONG_ADMIN_CODE"), res);
    }
    logger.info("[Login] admin user, code provided is correct", {
      username,
    });

    if (!userFromDB.phone) { // if no phone saved, save it
      updateUserInDB(userFromDB._id, {
        phone: userFromRequest.phone
      });
    }

    proceedWithLogin(userFromDB);
    return res.status(200).json({
      // @ts-ignore
      token: userFromDB.getToken(),
      text: "Authentification réussi",
    });
  }

  // user already phone and no code provided --> send sms
  if (userFromDB.phone) {
    logger.info("[Login] admin user without a code provided", {
      username,
    });

    // no code provided : send sms with code
    return requestSMSAdminLogin(userFromDB.phone, service, res);
  }

  // user not already admin
  if (userFromRequest.email && userFromRequest.phone) {
    logger.info("[Login] new admin user", {
      username,
    });
    // creation of admin user
    updateUserInDB(userFromDB._id, {
      email: userFromRequest.email,
    });
    return requestSMSAdminLogin(userFromRequest.phone, service, res);
  }

  throw new Error("NO_CONTACT");
};
