const messenger = require("./main.js");
const whatsapp = require("./whatsapp.js");

module.exports = function (app) {
  app.post("", messenger.post);
  // app.get('',messenger.get);
  app.post("/whatsapp_post", whatsapp.whatsapp_post);
};
