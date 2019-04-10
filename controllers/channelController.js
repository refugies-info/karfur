const channel = require('./channel/lib.js');
const checkToken = require('./account/checkToken');

module.exports = function (app) {
  app.post('/add_channel', checkToken.getId, channel.add_channel);
  app.post('/get_channel', checkToken.getId, channel.get_channel);
}