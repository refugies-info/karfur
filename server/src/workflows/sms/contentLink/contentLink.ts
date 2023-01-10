import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { celebrate, Joi, Segments } from "celebrate";
import { sendSMS } from "../../../connectors/twilio/sendSMS";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";

const validator = celebrate({
  [Segments.BODY]: Joi.object({
    phone: Joi.string(),
    title: Joi.string(),
    url: Joi.string()
  })
});

interface Request {
  phone: string
  title: string
  url: string
}

const handler = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[contentLink] received", req.body);
    checkRequestIsFromSite(req.fromSite);

    const text = `Bonjour\nVoici le lien vers la fiche ${req.body.title} : ${req.body.url}`
    const smsSentOk = await sendSMS(text, req.body.phone);
    if (!smsSentOk) throw new Error("UNKOWN_ERROR");

    return res.status(200).json({ text: "Message envoyé" });
  } catch (error) {
    logger.error("[contentLink] error", { error: error.message });
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
