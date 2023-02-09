import { saveSelectedLanguages } from "src/modules/users/users.repository";
import { LangueId, User } from "src/typegoose";

export const setSelectedLanguages = (user: User, languesId: LangueId[]) => saveSelectedLanguages(user.id, languesId);

export default setSelectedLanguages;
