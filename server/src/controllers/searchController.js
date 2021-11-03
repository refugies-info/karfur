import { getContent } from "../workflows/search/getContent";
import { getNeeds } from "../workflows/search/getNeeds";


module.exports = function (app) {
  app.get("/content", getContent);
  app.get("/needs", getNeeds);
};
