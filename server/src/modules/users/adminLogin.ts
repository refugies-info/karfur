import logger from "../../logger";
import { UserDoc } from "../../schema/schemaUser";
import { updateUserInDB } from "./users.repository";
const { accountSid, authToken } = process.env;
const client = require("twilio")(accountSid, authToken);
const twilioService = client.verify.services.create({ friendlyName: "Réfugiés.info" });

export const requestSMSAdminLogin = async (
  phone: string
) => {
  try {
    const service = await twilioService;
    await client.verify.services(service.sid)
      .verifications.create({ to: `+33${phone}`, channel: "sms" })
  } catch (e) {
    logger.error("[Login] error while sending sms for admin", {
      phone,
      error: e,
    });
    throw new Error("ERROR_WHILE_SENDING_ADMIN_CODE")
  }
  logger.info("[Login] admin, sms successfully sent to user", {
    phone,
  });
  throw new Error("NO_CODE_SUPPLIED");
};

export const verifyCode = async(
  phone: string,
  code: string
) => {
  const service = await twilioService;
  const check = await client.verify.services(service.sid)
    .verificationChecks.create({ to: `+33${phone}`, code: code });

  const codeOK = check.status === "approved";

  if (!codeOK) {
    logger.error("[Login] error while verifying admin code", {
      phone,
    });
    throw new Error("WRONG_ADMIN_CODE");
  }
  logger.info("[Login] admin user, code provided is correct", {
    phone,
  });
  return true;
}

export const adminLogin = async (
  userFromRequest: {
    username: string;
    password: string;
    code?: string;
    email?: string;
    phone?: string;
  },
  userFromDB: UserDoc
) => {
    const username = userFromRequest.username;
    logger.info("[Login] admin user", {
      username,
    });

    // CASE 1: has phone and code --> check code
    const phone = userFromDB.phone || userFromRequest.phone;
    if (phone && userFromRequest.code) {
      logger.info("[Login] admin user with a code provided", {
        username,
      });

      await verifyCode(phone, userFromRequest.code);

      if (!userFromDB.phone) { // if no phone saved, save it
        updateUserInDB(userFromDB._id, {
          phone: userFromRequest.phone
        });
      }
      return true;
    }

    // CASE 2: has phone and no code --> send sms
    if (userFromDB.phone) {
      logger.info("[Login] admin user without a code provided", {
        username,
      });

      // no code provided : send sms with code
      return requestSMSAdminLogin(userFromDB.phone);
    }

    // CASE 3: user not already admin
    if (userFromRequest.email && userFromRequest.phone) {
      logger.info("[Login] new admin user", {
        username,
      });
      // creation of admin user
      updateUserInDB(userFromDB._id, {
        email: userFromRequest.email,
      });
      return requestSMSAdminLogin(userFromRequest.phone);
    }

    // CASE 4: missing contact infos
    throw new Error("NO_CONTACT");
};
