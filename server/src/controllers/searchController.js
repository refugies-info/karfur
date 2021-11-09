import { getContent } from "../workflows/search/getContent";

module.exports = function (app) {
  app.get("/content", getContent);
};
