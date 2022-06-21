import express from "express";
const router = express.Router();
import { sendDraftReminderMail } from "../workflows/mail/sendDraftReminderMail";
import { sendReminderMailToUpdateContents } from "../workflows/mail/sendReminderMailToUpdateContents";
import { sendAdminImprovementsMail } from "../workflows/mail/sendAdminImprovementsMail";
import { sendSubscriptionReminderMail } from "../workflows/mail/sendSubscriptionReminderMail";
const checkToken = require("./account/checkToken");

router.post("/sendDraftReminderMail", sendDraftReminderMail);
router.post(
  "/sendReminderMailToUpdateContents",
  sendReminderMailToUpdateContents
);
router.post(
  "/sendAdminImprovementsMail",
  checkToken.check,
  sendAdminImprovementsMail
);
router.post("/sendSubscriptionReminderMail", sendSubscriptionReminderMail);

module.exports = router;

