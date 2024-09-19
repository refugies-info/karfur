import { slackDeletedAccount } from "~/connectors/slack/sendSlackNotif";
import { sendAccountDeletedMailService } from "~/modules/mail/mail.service";
import { deleteUser } from "~/modules/users/users.service";
import { User } from "~/typegoose";

export const deleteMyAccount = async (user: User) => {
  await deleteUser(user);
  if (user.email) {
    await sendAccountDeletedMailService(user.email);
    await slackDeletedAccount(user.email);
  }
};
