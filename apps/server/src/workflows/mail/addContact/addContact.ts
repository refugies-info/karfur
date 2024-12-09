import { AddContactRequest } from "@refugies-info/api-types";
import { addToNewsletter } from "~/connectors/brevo/addToNewsletter";

export const addContact = async (body: AddContactRequest): Promise<void> => addToNewsletter(body.email);
