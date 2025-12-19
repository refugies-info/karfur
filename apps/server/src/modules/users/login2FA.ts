import twilio from "twilio";
import type { ServiceInstance } from "twilio/lib/rest/verify/v2/service";
import logger from "~/logger";
import LoginError, { LoginErrorType } from "./LoginError";

const { accountSid, authToken } = process.env;

// Init Twilio service
const client = twilio(accountSid, authToken);

const getTwilioService = () => {
  return client.verify.v2.services
    .list({ limit: 1 })
    .then((existingServices: ServiceInstance[]) => {
      if (existingServices.length === 0) {
        return client.verify.v2.services.create({ friendlyName: "Réfugiés.info" });
      }
      return existingServices[0];
    });
};

export const requestEmailLogin = async (email: string) => {
  try {
    const service = await getTwilioService();
    logger.info("[Login] using twilio service", { sid: service.sid });
    await client.verify.v2
      .services(service.sid)
      .verifications.create({ to: email, channel: "email" });
  } catch (e) {
    logger.error("[Login] error while sending email for", {
      email,
      error: e,
    });
    throw new LoginError(LoginErrorType.ERROR_WHILE_SENDING_CODE);
  }
  logger.info("[Login] email successfully sent to user", { email });
  return true;
};

export const verifyCode = async (email: string, code: string) => {
  const service = await getTwilioService();
  logger.info("[Login] using twilio service", { sid: service.sid });
  const check = await client.verify.v2
    .services(service.sid)
    .verificationChecks.create({ to: email, code: code });

  const codeOK = check.status === "approved";

  if (!codeOK) {
    logger.error("[Login] error while verifying code", { email });
    throw new LoginError(LoginErrorType.WRONG_CODE);
  }
  logger.info("[Login] user, code provided is correct", { email });
  return true;
};
