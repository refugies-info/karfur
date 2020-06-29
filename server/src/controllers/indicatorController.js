const indicator = require("./indicator/lib.js");

module.exports = function (app) {
  app.post("/set_indicator", indicator.post_indicator);
  app.post("/get_indicator", indicator.get_indicator);
};
