import { deleteFromNewsletterList } from "~/connectors/brevo/addToNewsletter";
import { User } from "~/typegoose";

export const deleteContact = async (user: User): Promise<void> => deleteFromNewsletterList(user.email);
