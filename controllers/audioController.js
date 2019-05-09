const tts = require('./tts/lib.js');

module.exports = function (app) {
  app.post('/get_audio',tts.get_audio);
}