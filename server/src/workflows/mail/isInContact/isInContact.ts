import { User } from "../../../typegoose";
import { isInNewsletterList } from "../../../connectors/sendinblue/addToNewsletter";


export const isInContact = async (user: User): Promise<boolean> => isInNewsletterList(user.email)
