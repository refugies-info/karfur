const role = require('./role/lib.js');
const checkToken = require('./account/checkToken');

module.exports = function (app) {
  // app.post('/set_role',role.set_role);
  app.post('/get_role', checkToken.check, role.get_role);
}