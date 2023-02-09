import express from "express";
const router = express.Router();
const langues = require("./langues/lib");
import { getLanguages } from "../workflows/langues/getLanguages";

/* TODO: use tsoa */

router.post("/get_langues", langues.get_langues);
router.get("/getLanguages", getLanguages);

module.exports = router;
