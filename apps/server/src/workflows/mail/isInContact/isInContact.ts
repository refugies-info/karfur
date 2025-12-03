import { isInNewsletterList } from "~/connectors/brevo";
import type { User } from "~/typegoose";

export const isInContact = async (user: User): Promise<boolean> => isInNewsletterList(user.email);
