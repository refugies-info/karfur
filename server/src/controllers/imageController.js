const image = require("./image/lib.js");

module.exports = function (app) {
  app.post("/set_image", image.set_image);
  app.post("/get_image", image.get_image);
};
