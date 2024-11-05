import { sendAccountDeletedMailService } from "~/modules/mail/mail.service";
import { getUserById } from "~/modules/users/users.repository";
import { deleteUser as deleteUserService } from "~/modules/users/users.service";

export const deleteUser = async (id: string) => {
  const user = await getUserById(id, { email: 1, structures: 1 });
  const email = user?.email;
  if (!user) throw new Error("INVALID_REQUEST");

  await deleteUserService(user);

  if (email) {
    await sendAccountDeletedMailService(email);
  }
};
