import express from "express";
const router = express.Router();
import { updateIndex } from "../workflows/search/updateIndex";

router.get("/update-index", updateIndex);

module.exports = router;
