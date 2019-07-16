const account = require('./account/lib.js');
const checkToken = require('./account/checkToken');
const franceConnect = require('./account/france-connect.js');

module.exports = function (app) {
  app.post('/login', checkToken.getRoles,account.login);
  app.post('/signup', checkToken.getRoles,account.signup);
  app.post('/checkUserExists', account.checkUserExists);
  app.post('/set_user_info', checkToken.check, account.set_user_info);
  app.post('/get_users', checkToken.check, account.get_users);
  app.post('/get_user_info', checkToken.check, account.get_user_info);

  app.post('/FClogin', franceConnect.FClogin);
  app.post('/FClogout', franceConnect.FClogout);
  app.post('/getUser', franceConnect.getUser);
}