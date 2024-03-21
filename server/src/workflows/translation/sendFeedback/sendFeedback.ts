import { SendFeedbackRequest } from "@refugies-info/api-types";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { addFeedbackToAirtable } from "../../../modules/traductions/traductions.service";
import { getUserById } from "../../../modules/users/users.repository";
import { User } from "../../../typegoose";

const sendFeedback = async (
  body: SendFeedbackRequest,
  user: User,
): Promise<void> => {
  const dispositif = await getDispositifById(body.contentId, { translations: 1, theme: 1, typeContenu: 1 }, "theme")

  await Promise.all(body.feedbacks.map(feedback => (
    getUserById(feedback.translatorId, { username: 1, email: 1 })
      .then(translator => addFeedbackToAirtable(translator, user, dispositif, body.language, feedback))
  )))
}

export default sendFeedback;
