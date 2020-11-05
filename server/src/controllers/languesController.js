const langues = require("./langues/lib");
const checkToken = require("./account/checkToken");
import {
  getLanguages,
  updateLanguagesAvancement,
} from "./langues/langues.service";

module.exports = function (app) {
  app.post("/create_langues", checkToken.check, langues.create_langues);
  app.post("/get_langues", langues.get_langues);
  app.get("/getLanguages", getLanguages);
  app.post("/updateLanguagesAvancement", updateLanguagesAvancement);
};
