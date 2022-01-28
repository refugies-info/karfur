import { setMail } from "../workflows/miscellaneaous/setMail";
const sms = require("./miscellaneous/sms.js");

module.exports = function (app) {
  app.post("/set_mail", setMail);
  app.post("/send_sms", sms.send_sms);
  /* NOT USED
  app.post("/updateAirtableContenus", updateAirtableContenus);
  app.post("/testSendMail", testSendMail);
  */
};
