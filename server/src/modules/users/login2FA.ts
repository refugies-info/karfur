import logger from "../../logger";
import LoginError, { LoginErrorType } from "./LoginError";

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

export const requestEmailLogin = async (email: string) => {
  try {
    const service = await twilioService;
    logger.info("[Login] using twilio service", { sid: service.sid });
    await client.verify.services(service.sid).verifications.create({ to: email, channel: "email" });
  } catch (e) {
    logger.error("[Login] error while sending email for", {
      email,
      error: e
    });
    throw new LoginError(LoginErrorType.ERROR_WHILE_SENDING_CODE);
  }
  logger.info("[Login] email successfully sent to user", { email });
  throw new LoginError(LoginErrorType.NO_CODE_SUPPLIED);
};

export const verifyCode = async (email: string, code: string) => {
  const service = await twilioService;
  logger.info("[Login] using twilio service", { sid: service.sid });
  const check = await client.verify.services(service.sid).verificationChecks.create({ to: email, code: code });

  const codeOK = check.status === "approved";

  if (!codeOK) {
    logger.error("[Login] error while verifying code", { email });
    throw new LoginError(LoginErrorType.WRONG_CODE);
  }
  logger.info("[Login] user, code provided is correct", { email });
  return true;
};

