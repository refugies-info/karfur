import * as SibApiV3Sdk from "@sendinblue/client";
import logger from "../../../logger";
import { AddContactRequest } from "../../../controllers/mailController";
import { Response } from "../../../types/interface";
import { InvalidRequestError } from "../../../errors";

let apiInstance = new SibApiV3Sdk.ContactsApi();
apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, process.env.SENDINBLUE_API_KEY);

export const addContact = async (body: AddContactRequest): Response => {
  if (process.env.NODE_ENV === "dev") {
    logger.error("[setMail] mail not saved in DEV");
    return { text: "success" }
  }

  const createContactRequest = new SibApiV3Sdk.CreateContact();
  createContactRequest.email = body.email;
  createContactRequest.listIds = [57]; // ID of RI contact list

  await apiInstance.createContact(createContactRequest).then(
    function () {
      logger.info("[setMail] API called successfully.");
    },
    function (error) {
      logger.error("[setMail] Error while creating contact", error);
      if (error.response.statusCode === 400 && error.response.body?.message === "Contact already exist")
        throw new InvalidRequestError("This email is already in the list.", "CONTACT_ALREADY_EXIST");
      throw new Error("Error while creating contact");
    }
  );

  return { text: "success" }
};

