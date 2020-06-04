const events = require("./events/lib.js");
const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.post("/log_event", checkToken.getId, events.log_event);
  app.post("/get_event", checkToken.check, events.get_event);
  app.post(
    "/distinct_count_event",
    checkToken.check,
    events.distinct_count_event
  );
  app.post("/distinct_event", checkToken.check, events.distinct_event);
  app.post("/aggregate_events", checkToken.getId, events.aggregate_events);
};
