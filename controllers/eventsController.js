const events = require('./events/lib.js');

module.exports = function (app) {
    app.post('/log',events.log);
    app.post('/get',events.get);
}