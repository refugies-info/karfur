import { Response } from "../../../types/interface";
import { getUserById, updateUserInDB } from "../../../modules/users/users.repository";
import { removeMemberFromStructure } from "../../../modules/structure/structure.repository";
import { generateRandomId } from "../../../libs/generateRandomId";
import { sendAccountDeletedMailService } from "../../../modules/mail/mail.service";
import { UserStatus } from "src/typegoose/User";



export const deleteUser = async (id: string): Response => {
  const user = await getUserById(id, { email: 1, structures: 1 });
  const email = user?.email;
  if (!user) throw new Error("INVALID_REQUEST");

  if (user.structures)
    await Promise.all(user.structures?.map((structure) => removeMemberFromStructure(structure._id, id)));

  await updateUserInDB(id, {
    username: `utilisateur_${generateRandomId()}`,
    password: "",
    email: "",
    phone: "",
    picture: null,
    roles: [],
    authy_id: "",
    cookies: null,
    reset_password_token: "",
    structures: [],
    status: UserStatus.USER_STATUS_DELETED,
  });

  if (email) {
    await sendAccountDeletedMailService(email);
  }

  return { text: "success" }
};

