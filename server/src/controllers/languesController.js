const langues = require("./langues/lib");
import { getLanguages } from "./langues/langues.service";

module.exports = function (app) {
  app.post("/get_langues", langues.get_langues);
  app.get("/getLanguages", getLanguages);
};
