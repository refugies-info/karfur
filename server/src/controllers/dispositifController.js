import express from "express";
const router = express.Router();
const dispositif = require("./dispositif/lib.js");
const checkToken = require("./account/checkToken");

import { updateNbVuesOrFavoritesOnContent } from "../workflows/dispositif/updateNbVuesOrFavoritesOnContent";
import { getDispositifs } from "../workflows/dispositif/getDispositifs";
import { getAllDispositifs } from "../workflows/dispositif/getAllDispositifs";
import { updateDispositifStatus } from "../workflows/dispositif/updateDispositifStatus";
import { modifyDispositifMainSponsor } from "../workflows/dispositif/modifyDispositifMainSponsor";
import { updateDispositifAdminComments } from "../workflows/dispositif/updateDispositifAdminComments";
import { getNbDispositifsByRegion } from "../workflows/dispositif/getNbDispositifsByRegion";
import { updateDispositifReactions } from "../workflows/dispositif/updateDispositifReactions";
import { getUserContributions } from "../workflows/dispositif/getUserContributions";
import { getDispositifsWithTranslationAvancement } from "../workflows/dispositif/getDispositifsWithTranslationAvancement";
import { exportFiches } from "../workflows/dispositif/exportFiches";
import { addDispositif } from "../workflows/dispositif/addDispositif";
import { exportDispositifsGeolocalisation } from "../workflows/dispositif/exportDispositifsGeolocalisation";
import { getContentsForApp } from "../workflows/dispositif/getContentsForApp";
import { updateDispositifTagsOrNeeds } from "../workflows/dispositif/updateDispositifTagsOrNeeds";
import { getContentById } from "../workflows/dispositif/getContentById";
import { getNbContents } from "../workflows/dispositif/getNbContents";
import { getStatistics } from "../workflows/dispositif/getStatistics";

router.post("/addDispositif", checkToken.getId, checkToken.check, addDispositif);
router.post("/add_dispositif_infocards", checkToken.check, dispositif.add_dispositif_infocards);
router.post("/get_dispositif", dispositif.get_dispositif);
router.post("/count_dispositifs", dispositif.count_dispositifs);
router.post("/getDispositifs", getDispositifs);
router.get("/getAllDispositifs", getAllDispositifs);
router.post("/updateDispositifStatus", checkToken.check, updateDispositifStatus);
router.post("/modifyDispositifMainSponsor", checkToken.check, modifyDispositifMainSponsor);
router.post("/updateDispositifAdminComments", checkToken.check, updateDispositifAdminComments);
router.get("/getNbDispositifsByRegion", getNbDispositifsByRegion);
router.post("/updateNbVuesOrFavoritesOnContent", updateNbVuesOrFavoritesOnContent);
router.post("/updateDispositifReactions", checkToken.getId, updateDispositifReactions);
router.get("/getUserContributions", checkToken.check, getUserContributions);
router.get("/getDispositifsWithTranslationAvancement", checkToken.check, getDispositifsWithTranslationAvancement);
router.post("/exportFiches", exportFiches);
router.post("/exportDispositifsGeolocalisation", exportDispositifsGeolocalisation);
router.get("/getContentsForApp", getContentsForApp);
router.post("/updateDispositifTagsOrNeeds", checkToken.check, updateDispositifTagsOrNeeds);
router.get("/getContentById", getContentById);
router.get("/getNbContents", getNbContents);
router.get("/statistics", getStatistics);
/* NOT USED
router.post("/addNeedsFromAirtable", addNeedsFromAirtable);
router.post("/fixAudienceAgeOnContents", fixAudienceAgeOnContents);
router.post(
  "/get_dispo_progression",
  checkToken.check,
  dispositif.get_dispo_progression
);
*/

module.exports = router;
