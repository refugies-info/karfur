import { ContactsApi, ContactsApiApiKeys, CreateContact } from "@getbrevo/brevo";
import { InvalidRequestError } from "~/errors";
import logger from "~/logger";

const apiInstance = new ContactsApi();

const { BREVO_API_KEY } = process.env;

apiInstance.setApiKey(ContactsApiApiKeys.apiKey, BREVO_API_KEY);

const RI_CONTACTS_LIST = 57;

export const deleteFromNewsletterList = async (email: string) => {
  try {
    await apiInstance.deleteContact(email);
  } catch (e) {
    logger.error("[deleteFromNewsletterList] Error while deleting contact", e);
  }
};

export const addToNewsletter = async (email: string) => {
  if (process.env.NODE_ENV === "dev") {
    logger.error("[setMail] mail not saved in DEV");
    return;
  }

  // Check if in list and unsubscribe
  try {
    const data = await apiInstance.getContactInfo(email);
    if (data.body.listUnsubscribed?.includes(RI_CONTACTS_LIST)) {
      await deleteFromNewsletterList(email);
    }
    // eslint-disable-next-line no-empty, @typescript-eslint/no-unused-vars
  } catch (_) {}

  const createContactRequest = new CreateContact();
  createContactRequest.email = email;
  createContactRequest.listIds = [RI_CONTACTS_LIST];

  await apiInstance.createContact(createContactRequest).then(
    () => {
      logger.info("[setMail] API called successfully.");
    },
    (error: unknown) => {
      logger.error("[setMail] Error while creating contact", String(error));
      if (
        typeof error === "object" &&
        "response" in error &&
        typeof error.response === "object" &&
        "statusCode" in error.response &&
        "body" in error.response &&
        typeof error.response.body === "object" &&
        "message" in error.response.body &&
        error.response.statusCode === 400 &&
        error.response.body.message === "Contact already exist"
      )
        throw new InvalidRequestError(
          "This email is already in the list.",
          "CONTACT_ALREADY_EXIST",
        );
      throw new Error("Error while creating contact");
    },
  );
  return;
};

export const isInNewsletterList = async (email: string) => {
  try {
    const data = await apiInstance.getContactInfo(email);
    if (data.body.listIds.includes(RI_CONTACTS_LIST)) {
      if (data.body.listUnsubscribed?.includes(RI_CONTACTS_LIST)) return false;
      return true;
    }
    return false;
  } catch (e) {
    if (e.response.statusCode !== 404) {
      logger.error("[isInNewsletterList] Error while getting contact", e);
    }
    return false;
  }
};
