import { updateIndex } from "../workflows/search/updateIndex";

module.exports = function (app) {
  app.get("/update-index", updateIndex);
};
