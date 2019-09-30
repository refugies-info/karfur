const miscellaneous = require('./miscellaneous/lib.js');

module.exports = function (app) {
  app.post('/set_mail',miscellaneous.set_mail);
}