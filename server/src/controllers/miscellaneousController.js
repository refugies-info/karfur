const airtable_mail = require("./miscellaneous/airtable_mail.js");
const sms = require("./miscellaneous/sms.js");

module.exports = function (app) {
  app.post("/set_mail", airtable_mail.set_mail);
  app.post("/send_sms", sms.send_sms);
  /* NOT USED
  app.post("/updateAirtableContenus", updateAirtableContenus);
  app.post("/testSendMail", testSendMail);
  */
};
