import { deleteFromNewsletterList } from "~/connectors/sendinblue/addToNewsletter";
import { User } from "~/typegoose";

export const deleteContact = async (user: User): Promise<void> => deleteFromNewsletterList(user.email);
