const audio = require("./audio/lib");

module.exports = function (app) {
  app.post("/set_audio", audio.set_audio);
  app.post("/get_audio", audio.get_audio);
};
