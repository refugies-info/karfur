const audio = require("./audio/lib");
const { set_audio } = require("./audio/lib");

module.exports = function (app) {
  app.post("/set_audio", set_audio);
  app.post("/get_audio", audio.get_audio);
};
