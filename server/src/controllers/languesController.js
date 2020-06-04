const langues = require("./langues/lib");
const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.post("/create_langues", checkToken.check, langues.create_langues);
  app.post("/get_langues", langues.get_langues);
};
