import type { User } from "@refugies-info/mongo";
import { deleteFromNewsletterList } from "~/connectors/brevo";

export const deleteContact = async (user: User): Promise<void> =>
  deleteFromNewsletterList(user.email);
