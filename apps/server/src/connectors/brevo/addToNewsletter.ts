import { BrevoClient, BrevoError } from "@getbrevo/brevo";
import { InvalidRequestError } from "~/errors";
import logger from "~/logger";

const { BREVO_API_KEY } = process.env;

const client = new BrevoClient({ apiKey: BREVO_API_KEY });

const RI_CONTACTS_LIST = 57;

export const deleteFromNewsletterList = async (email: string) => {
  try {
    await client.contacts.deleteContact({ identifier: email });
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
    const data = await client.contacts.getContactInfo({ identifier: email });
    if (data.listUnsubscribed?.includes(RI_CONTACTS_LIST)) {
      await deleteFromNewsletterList(email);
    }
    // eslint-disable-next-line no-empty, @typescript-eslint/no-unused-vars
  } catch (_) {}

  try {
    await client.contacts.createContact({ email, listIds: [RI_CONTACTS_LIST] });
    logger.info("[setMail] API called successfully.");
  } catch (error: unknown) {
    logger.error("[setMail] Error while creating contact", String(error));
    if (
      error instanceof BrevoError &&
      error.statusCode === 400 &&
      typeof error.body === "object" &&
      error.body !== null &&
      "code" in error.body &&
      (error.body as { code: string }).code === "duplicate_parameter"
    )
      throw new InvalidRequestError("This email is already in the list.", "CONTACT_ALREADY_EXIST");
    throw new Error("Error while creating contact");
  }
  return;
};

export const isInNewsletterList = async (email: string) => {
  try {
    const data = await client.contacts.getContactInfo({ identifier: email });
    if (data.listIds.includes(RI_CONTACTS_LIST)) {
      if (data.listUnsubscribed?.includes(RI_CONTACTS_LIST)) return false;
      return true;
    }
    return false;
  } catch (e) {
    if (!(e instanceof BrevoError && e.statusCode === 404)) {
      logger.error("[isInNewsletterList] Error while getting contact", e);
    }
    return false;
  }
};
