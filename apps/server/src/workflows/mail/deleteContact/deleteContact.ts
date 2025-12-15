import { deleteFromNewsletterList } from "~/connectors/brevo";
import type { User } from "~/typegoose";

export const deleteContact = async (user: User): Promise<void> =>
  deleteFromNewsletterList(user.email);
