const events = require("./events/lib.js");
const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.post("/get_event", checkToken.check, events.get_event);
};
