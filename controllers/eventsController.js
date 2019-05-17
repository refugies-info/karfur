const events = require('./events/lib.js');
const checkToken = require('./account/checkToken');

module.exports = function (app) {
  app.post('/log_event',checkToken.getId,events.log_event);
  app.post('/get',events.get);
  app.post('/distinct_count_event',events.distinct_count_event);
}