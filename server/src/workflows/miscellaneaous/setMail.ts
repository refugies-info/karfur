import { RequestFromClientWithBody, Res } from "../../types/interface";
import {
  checkRequestIsFromSite,
} from "../../libs/checkAuthorizations";
import logger from "../../logger";

interface Query {
  mail: string;
}

const mailjet = require("node-mailjet")
  .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

export const setMail = async (
  req: RequestFromClientWithBody<Query>,
  res: Res
) => {
  try {
    checkRequestIsFromSite(req.fromSite);

    if (!req?.body?.mail) {
      throw new Error("INVALID_REQUEST");
    }

    if (process.env.NODE_ENV === "dev") {
      logger.error("[setMail] mail not saved in DEV");
      return res.status(200).json({
        text: "Succès"
      });
    }

    const createContactRequest = await mailjet
      .post("contact", { "version": "v3" })
      .request({
        "IsExcludedFromCampaigns": "false",
        "Email": req.body.mail,
      });

    const contactId = (createContactRequest.body as any)?.Data?.[0]?.ID;
    if (!contactId) throw new Error("Error while creating contact");

    const request = await mailjet
      .post("contact", { "version": "v3" })
      .id(contactId)
      .action("managecontactslists")
      .request({
        "ContactsLists": [
          {
            "Action": "addforce",
            "ListID": 10199213 // ID Newsletter Réfugiés.info
          }
        ]
      })

    return res.status(200).json({
      text: "Succès",
      data: request.body
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
