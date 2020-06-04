const themes = require("./themes/lib.js");
const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.post("/create_theme", checkToken.check, themes.create_theme);
  app.post("/get_themes", themes.get_themes);
};
