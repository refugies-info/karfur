import { sendDraftReminderMail } from "../workflows/mail/sendDraftReminderMail";
import { sendAdminImprovementsMail } from "../workflows/mail/sendAdminImprovementsMail";
const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.post("/sendDraftReminderMail", sendDraftReminderMail);
  app.post(
    "/sendAdminImprovementsMail",
    checkToken.check,
    sendAdminImprovementsMail
  );
};
