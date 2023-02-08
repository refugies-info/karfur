import express from "express";
import * as traduction from "./traduction/lib";
import * as checkToken from "./account/checkToken";
import { validateTranslations } from "../workflows/translation/validateTranslations";
import getStatistics from "../workflows/translation/getStatistics";

const router = express.Router();

/* TODO: use tsoa */

// @ts-ignore FIXME
router.post("/add_tradForReview", checkToken.check, traduction.add_tradForReview);
router.post("/get_tradForReview", checkToken.check, traduction.get_tradForReview);
// @ts-ignore FIXME
router.post("/validateTranslations", checkToken.check, validateTranslations);
router.post("/update_tradForReview", checkToken.check, traduction.update_tradForReview);
router.post("/get_progression", checkToken.check, traduction.get_progression);
router.post("/delete_trads", checkToken.check, traduction.delete_trads);
router.get("/statistics", getStatistics);

module.exports = router;
