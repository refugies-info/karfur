import { retrieveNeedsFromAirtable } from "../workflows/needs/retrieveNeedsFromAirtable";
import { getNeeds } from "../workflows/needs/getNeeds";
import { saveNeed } from "../workflows/needs/saveNeed";
import { createNeed } from "../workflows/needs/createNeed";

const checkToken = require("./account/checkToken");

module.exports = function (app) {
  app.get("/retrieveNeedsFromAirtable", retrieveNeedsFromAirtable);
  app.get("/getNeeds", getNeeds);
  app.post("/saveNeed", checkToken.check, checkToken.getRoles, saveNeed);
  app.post("/createNeed", checkToken.check, checkToken.getRoles, createNeed);
};
