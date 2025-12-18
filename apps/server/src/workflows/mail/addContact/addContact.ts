import type { AddContactRequest } from "@refugies-info/api-types";
import { addToNewsletter } from "~/connectors/brevo";
import { sendNewsletterSubscriptionEmail } from "~/modules/mail/mail.service";

export const addContact = async (body: AddContactRequest): Promise<void> => {
  await addToNewsletter(body.email);
  await sendNewsletterSubscriptionEmail(body.email, false);
};
