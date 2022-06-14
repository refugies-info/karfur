import express from "express";
const router = express.Router();
import { setMail } from "../workflows/miscellaneaous/setMail";
// import { updateAirtableContenus } from "../workflows/miscellaneaous/updateAirtableContenus";
const sms = require("./miscellaneous/sms.js");

router.post("/set_mail", setMail);
router.post("/send_sms", sms.send_sms);
/* NOT USED
router.post("/updateAirtableContenus", updateAirtableContenus);
router.post("/testSendMail", testSendMail);
*/

module.exports = router;
