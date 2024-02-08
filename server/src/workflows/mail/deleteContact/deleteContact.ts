import { User } from "../../../typegoose";
import { deleteFromNewsletterList } from "../../../connectors/sendinblue/addToNewsletter";


export const deleteContact = async (user: User): Promise<void> => deleteFromNewsletterList(user.email)
