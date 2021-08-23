import { retrieveNeedsFromAirtable } from "../workflows/needs/retrieveNeedsFromAirtable";
import { getNeeds } from "../workflows/needs/getNeeds";

module.exports = function (app) {
  app.get("/retrieveNeedsFromAirtable", retrieveNeedsFromAirtable);
  app.get("/getNeeds", getNeeds);
};
