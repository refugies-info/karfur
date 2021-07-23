import { retrieveNeedsFromAirtable } from "../workflows/needs/retrieveNeedsFromAirtable/retrieveNeedsFromAirtable";

module.exports = function (app) {
  app.get("/retrieveNeedsFromAirtable", retrieveNeedsFromAirtable);
};
