import * as SibApiV3Sdk from "@sendinblue/client";
import { InvalidRequestError } from "../../errors";
import logger from "../../logger";

let apiInstance = new SibApiV3Sdk.ContactsApi();
apiInstance.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, process.env.SENDINBLUE_API_KEY);


export const addToNewsletter = async (email: string) => {
  if (process.env.NODE_ENV === "dev") {
    logger.error("[setMail] mail not saved in DEV");
    return;
  }

  const createContactRequest = new SibApiV3Sdk.CreateContact();
  createContactRequest.email = email;
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
    },
  );
  return;
}
