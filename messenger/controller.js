const messenger = require('./main.js');

module.exports = function (app) {
  app.post('', messenger.post);
  // app.get('',messenger.get);
}