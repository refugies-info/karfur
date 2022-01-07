import { sendDraftReminderMail } from "../workflows/mail/sendDraftReminderMail";
import { sendReminderMailToUpdateContents } from "../workflows/mail/sendReminderMailToUpdateContents";
import { sendAdminImprovementsMail } from "../workflows/mail/sendAdminImprovementsMail";
import { sendSubscriptionReminderMail } from "../workflows/mail/sendSubscriptionReminderMail";
import { sendEnabled2FaEmail } from "../workflows/mail/sendEnabled2FaEmail";
const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.post("/sendDraftReminderMail", sendDraftReminderMail);
  app.post(
    "/sendReminderMailToUpdateContents",
    sendReminderMailToUpdateContents
  );
  app.post(
    "/sendAdminImprovementsMail",
    checkToken.check,
    checkToken.getRoles,
    sendAdminImprovementsMail
  );
  app.post("/sendSubscriptionReminderMail", sendSubscriptionReminderMail);
  app.post("/sendEnabled2FaEmail",  // TODO : delete once sent
    checkToken.check,
    sendEnabled2FaEmail
  );
};
