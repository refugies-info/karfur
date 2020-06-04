const article = require("./article/lib.js");
const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.post("/add_article", checkToken.check, article.add_article);
  app.post("/get_article", checkToken.getId, article.get_article);
  app.post("/add_traduction", checkToken.check, article.add_traduction);
  app.post("/remove_traduction", checkToken.check, article.remove_traduction);
};
