import { sendDraftReminderMail } from "../workflows/mail/sendDraftReminderMail";

module.exports = function (app) {
  app.post("/sendDraftReminderMail", sendDraftReminderMail);
};
