const account = require('./account/lib.js');
const checkToken = require('./account/checkToken');

module.exports = function (app) {
    app.post('/login',account.login);
    app.post('/signup',account.signup);
    app.post('/set_user_info', checkToken.check, account.set_user_info);
    app.post('/get_users', checkToken.check, account.get_users);
}