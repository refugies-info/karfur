import logger from "../../logger";
import LoginError from "./LoginError";
import { updateUserInDB } from "./users.repository";
import { getStructureFromDB } from "../structure/structure.repository";
import formatPhoneNumber from "../../libs/formatPhoneNumber";
import { StructureId, User } from "src/typegoose";
const { accountSid, authToken } = process.env;

// Init Twilio service
const client = require("twilio")(accountSid, authToken);
const twilioService: any = new Promise((resolve) => {
  client.verify.services.list({ limit: 1 }).then((existingServices: any) => {
    if (existingServices.length === 0) {
      client.verify.services.create({ friendlyName: "Réfugiés.info" }).then((res: any) => resolve(res));
    } else {
      resolve(existingServices[0]);
    }
  });
});

export const requestSMSLogin = async (phone: string) => {
  try {
    const service = await twilioService;
    logger.info("[Login] using twilio service", { sid: service.sid });
    await client.verify.services(service.sid).verifications.create({ to: `+33${phone}`, channel: "sms" });
  } catch (e) {
    logger.error("[Login] error while sending sms for", {
      phone,
      error: e
    });
    throw new LoginError("ERROR_WHILE_SENDING_CODE");
  }
  logger.info("[Login], sms successfully sent to user", {
    phone
  });
  throw new LoginError("NO_CODE_SUPPLIED", { phone: "XXXXXXXX" + phone.slice(-2) });
};

export const verifyCode = async (phone: string, code: string) => {
  const service = await twilioService;
  logger.info("[Login] using twilio service", { sid: service.sid });
  const check = await client.verify.services(service.sid).verificationChecks.create({ to: `+33${phone}`, code: code });

  const codeOK = check.status === "approved";

  if (!codeOK) {
    logger.error("[Login] error while verifying code", {
      phone
    });
    throw new LoginError("WRONG_CODE");
  }
  logger.info("[Login] user, code provided is correct", {
    phone
  });
  return true;
};

export const login2FA = async (
  userFromRequest: {
    username: string;
    password: string;
    code?: string;
    email?: string;
    phone?: string;
  },
  userFromDB: User,
  role: StructureId | string
) => {
  const username = userFromRequest.username;
  logger.info("[Login] 2FA user", {
    username
  });

  // CASE 1: has phone and code --> check code
  const phone = userFromDB.phone || formatPhoneNumber(userFromRequest.phone);
  if (phone && userFromRequest.code) {
    logger.info("[Login] 2FA user with a code provided", {
      username
    });

    await verifyCode(phone, userFromRequest.code);

    if (!userFromDB.phone) {
      // if no phone saved, save it
      await updateUserInDB(userFromDB._id, { phone });
    }
    return true;
  }

  // CASE 2: has phone and no code --> send sms
  if (userFromDB.phone) {
    logger.info("[Login] 2FA user without a code provided", {
      username
    });

    // no code provided : send sms with code
    return requestSMSLogin(userFromDB.phone);
  }

  // CASE 3: user has not already activated 2FA
  if (userFromRequest.email && userFromRequest.phone) {
    logger.info("[Login] new 2FA user", {
      username
    });
    // creation of user
    await updateUserInDB(userFromDB._id, {
      email: userFromRequest.email
    });
    return requestSMSLogin(phone);
  }

  // CASE 4: missing contact infos
  let structure: any = {};
  if (role !== "admin") {
    structure = await getStructureFromDB(role, false, { nom: 1, picture: 1 });
  }
  throw new LoginError("NO_CONTACT", {
    role,
    email: userFromDB.email,
    structure
  });
};
