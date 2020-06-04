const tts = require("./tts/lib.js");

module.exports = function (app) {
  app.post("/get_tts", tts.get_tts);
};
