import { celebrate, Joi, Segments } from "celebrate";
import * as SibApiV3Sdk from "@sendinblue/client";
import { RequestFromClientWithBody, Res } from "../../types/interface";
import { checkRequestIsFromSite } from "../../libs/checkAuthorizations";
import logger from "../../logger";

const validator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    mail: Joi.string(),
  })
});
interface Request {
  mail: string;
}

let apiInstance = new SibApiV3Sdk.ContactsApi()
apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, process.env.SENDINBLUE_API_KEY);

export const setMail = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    checkRequestIsFromSite(req.fromSite);

    if (process.env.NODE_ENV === "dev") {
      logger.error("[setMail] mail not saved in DEV");
      return res.status(200).json({
        text: "Succès"
      });
    }

    const createContactRequest = new SibApiV3Sdk.CreateContact();
    createContactRequest.email = req.body.mail;
    createContactRequest.listIds = [57]; // ID of RI contact list

    await apiInstance.createContact(createContactRequest).then(function () {
      logger.info("[setMail] API called successfully.");
    }, function (error) {
      logger.error("[setMail] Error while creating contact", error);
      throw new Error("Error while creating contact");
    });

    return res.status(200).json({
      text: "Succès",
    });
  } catch (error) {
    logger.error("[setMail] error", {
      error: error.message,
    });
    switch (error.message) {
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, setMail];
