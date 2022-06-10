import { setMail } from "../workflows/miscellaneaous/setMail";
import { updateAirtableContenus } from "../workflows/miscellaneaous/updateAirtableContenus";
const sms = require("./miscellaneous/sms.js");

module.exports = function (app) {
  app.post("/set_mail", setMail);
  app.post("/send_sms", sms.send_sms);
  app.post("/updateAirtableContenus", updateAirtableContenus);
  /* NOT USED
  app.post("/testSendMail", testSendMail);
  */
};
