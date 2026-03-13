import type { Id } from "@refugies-info/api-types";
import type { User } from "@refugies-info/mongo";
import { saveSelectedLanguages } from "~/modules/users/users.repository";

export const setSelectedLanguages = (user: User, languesId: Id[]) =>
  saveSelectedLanguages(user.id, languesId);

export default setSelectedLanguages;
