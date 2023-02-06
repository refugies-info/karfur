import express from "express";
import { get_translation } from "./translate/lib";

const router = express.Router();

router.post("/get_translation", get_translation);

module.exports = router;
