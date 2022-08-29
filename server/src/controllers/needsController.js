import express from "express";
const router = express.Router();
const checkToken = require("./account/checkToken");

import getNeeds from "../workflows/needs/getNeeds";
import saveNeed from "../workflows/needs/saveNeed";
import createNeed from "../workflows/needs/createNeed";
import deleteNeed from "../workflows/needs/deleteNeed";
// import { retrieveNeedsFromAirtable } from "../workflows/needs/retrieveNeedsFromAirtable";
// import { extractNeedsFichesFromAirtable } from "../workflows/needs/extractNeedsFichesFromAirtable";

router.get("/", getNeeds);
router.post("/", checkToken.check, checkToken.getRoles, createNeed);
router.patch("/:id", checkToken.check, checkToken.getRoles, saveNeed);
router.delete("/:id", checkToken.check, checkToken.getRoles, deleteNeed);
// router.get("/retrieveNeedsFromAirtable", retrieveNeedsFromAirtable);
// router.post("/extractNeedsFichesFromAirtable", extractNeedsFichesFromAirtable);

module.exports = router;
