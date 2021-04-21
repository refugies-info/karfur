const langues = require("./langues/lib");
import { getLanguages } from "../workflows/langues/getLanguages";

module.exports = function (app) {
  app.post("/get_langues", langues.get_langues);
  app.get("/getLanguages", getLanguages);
};
