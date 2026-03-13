import type { User } from "@refugies-info/mongo";
import { isInNewsletterList } from "~/connectors/brevo";

export const isInContact = async (user: User): Promise<boolean> => isInNewsletterList(user.email);
