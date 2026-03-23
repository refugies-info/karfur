import type { User } from "@refugies-info/mongo";
import { slackDeletedAccount } from "~/connectors/slack/sendSlackNotif";
import { sendAccountDeletedMailService } from "~/modules/mail/mail.service";
import { deleteUser } from "~/modules/users/users.service";

export const deleteMyAccount = async (user: User) => {
  await deleteUser(user);
  if (user.email) {
    await sendAccountDeletedMailService(user.email, user._id);
    await slackDeletedAccount(user.email);
  }
};
