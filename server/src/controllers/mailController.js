import { sendDraftReminderMail } from "../workflows/mail/sendDraftReminderMail";
import { sendAdminImprovementsMail } from "../workflows/mail/sendAdminImprovementsMail";
import { sendSubscriptionReminderMail } from "../workflows/mail/sendSubscriptionReminderMail";
const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.post("/sendDraftReminderMail", sendDraftReminderMail);
  app.post(
    "/sendAdminImprovementsMail",
    checkToken.check,
    sendAdminImprovementsMail
  );
  app.post("/sendSubscriptionReminderMail", sendSubscriptionReminderMail);
};
