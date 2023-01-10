import express from "express";
const router = express.Router();
import setMail from "../workflows/miscellaneaous/setMail";
// import { updateAirtableContenus } from "../workflows/miscellaneaous/updateAirtableContenus";

router.post("/set_mail", setMail);
/* NOT USED
router.post("/updateAirtableContenus", updateAirtableContenus);
router.post("/testSendMail", testSendMail);
*/

module.exports = router;
