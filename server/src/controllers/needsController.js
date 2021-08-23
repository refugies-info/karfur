import { retrieveNeedsFromAirtable } from "../workflows/needs/retrieveNeedsFromAirtable";
import { getNeeds } from "../workflows/needs/getNeeds";
import { saveNeed } from "../workflows/needs/saveNeed/saveNeed";
const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.get("/retrieveNeedsFromAirtable", retrieveNeedsFromAirtable);
  app.get("/getNeeds", getNeeds);
  app.post("/saveNeed", checkToken.check, checkToken.getRoles, saveNeed);
};
