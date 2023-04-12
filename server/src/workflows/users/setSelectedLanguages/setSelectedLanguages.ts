import { Id } from "@refugies-info/api-types";
import { saveSelectedLanguages } from "../../../modules/users/users.repository";
import { User } from "../../../typegoose";

export const setSelectedLanguages = (user: User, languesId: Id[]) => saveSelectedLanguages(user.id, languesId);

export default setSelectedLanguages;
