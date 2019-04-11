const channel = require('./channel/lib.js');
const checkToken = require('./account/checkToken');

module.exports = function (app, io) {
  app.post('/add_channel', checkToken.getId, (req,res)=>channel.add_channel(req,res,io));
  app.post('/get_channel', checkToken.getId, channel.get_channel);
}