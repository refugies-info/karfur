import express from "express";
const router = express.Router();
// import { retrieveNeedsFromAirtable } from "../workflows/needs/retrieveNeedsFromAirtable";
import { getNeeds } from "../workflows/needs/getNeeds";
import { saveNeed } from "../workflows/needs/saveNeed";
import { createNeed } from "../workflows/needs/createNeed";
// import { extractNeedsFichesFromAirtable } from "../workflows/needs/extractNeedsFichesFromAirtable";

const checkToken = require("./account/checkToken");

// router.get("/retrieveNeedsFromAirtable", retrieveNeedsFromAirtable);
router.get("/getNeeds", getNeeds);
router.post("/saveNeed", checkToken.check, checkToken.getRoles, saveNeed);
router.post("/createNeed", checkToken.check, checkToken.getRoles, createNeed);
// router.post("/extractNeedsFichesFromAirtable", extractNeedsFichesFromAirtable);

module.exports = router;
