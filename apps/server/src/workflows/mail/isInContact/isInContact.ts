import { isInNewsletterList } from "~/connectors/brevo/addToNewsletter";
import { User } from "~/typegoose";

export const isInContact = async (user: User): Promise<boolean> => isInNewsletterList(user.email);
