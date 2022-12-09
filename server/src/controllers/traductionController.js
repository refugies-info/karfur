import express from "express";
const router = express.Router();
const traduction = require("./traduction/lib.js");
const checkToken = require("./account/checkToken");
import { validateTranslations } from "../workflows/translation/validateTranslations";
import { getStatistics } from "../workflows/translation/getStatistics";

router.post("/add_tradForReview", checkToken.getId, checkToken.getRoles, traduction.add_tradForReview);
router.post("/get_tradForReview", checkToken.check, traduction.get_tradForReview);
router.post("/validateTranslations", checkToken.check, validateTranslations);
router.post("/update_tradForReview", checkToken.check, traduction.update_tradForReview);
router.post("/get_progression", checkToken.check, traduction.get_progression);
router.post("/delete_trads", checkToken.check, traduction.delete_trads);
router.get("/statistics", getStatistics);

module.exports = router;
