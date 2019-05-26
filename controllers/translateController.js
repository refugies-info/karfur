const translate = require('./translate/lib.js');

module.exports = function (app) {
  app.post('/get_translation',translate.get_translation);
}