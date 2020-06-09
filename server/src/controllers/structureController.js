const structure = require("./structure/lib.js");
const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.post("/add_structure", checkToken.check, structure.add_structure);
  app.post("/get_structure", structure.get_structure);
};
