import { User } from "../../../typegoose";
import { deleteUser } from "../../../modules/users/users.service";
import { sendAccountDeletedMailService } from "../../../modules/mail/mail.service";
import { slackDeletedAccount } from "../../../connectors/slack/sendSlackNotif";

export const deleteMyAccount = async (user: User) => {
  await deleteUser(user);
  if (user.email) {
    await sendAccountDeletedMailService(user.email);
    await slackDeletedAccount(user.email);
  }
}
