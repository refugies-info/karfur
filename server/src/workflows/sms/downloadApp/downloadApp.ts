import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { celebrate, Joi, Segments } from "celebrate";
import { sendSMS } from "../../../connectors/twilio/sendSMS";
import { getLocaleString as t } from "../../../libs/getLocaleString";

const validator = celebrate({
  [Segments.BODY]: Joi.object({
    phone: Joi.string(),
    locale: Joi.string()
  })
});

interface Request {
  phone: string
  locale: string
}

const handler = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[downloadApp] received", req.body);

    const text = `${t(req.body.locale, "downloadApp")} https://refugies.info/fr/download-app`
    const smsSentOk = await sendSMS(text, req.body.phone);
    if (!smsSentOk) throw new Error("UNKOWN_ERROR");

    return res.status(200).json({ text: "Succès" });
  } catch (error) {
    logger.error("[downloadApp] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, handler];
