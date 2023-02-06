import express from "express";
import * as dispositif from "./dispositif/lib";
import * as checkToken from "./account/checkToken";

import { updateNbVuesOrFavoritesOnContent } from "../workflows/dispositif/updateNbVuesOrFavoritesOnContent";
import getDispositifs from "../workflows/dispositif/getDispositifs";
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
import getStatistics from "../workflows/dispositif/getStatistics";
import updateDispositif from "../workflows/dispositif/updateDispositif";

const router = express.Router();

// @ts-ignore FIXME
router.post("/addDispositif", checkToken.getId, checkToken.check, addDispositif);
router.post("/add_dispositif_infocards", checkToken.check, dispositif.add_dispositif_infocards);
router.post("/get_dispositif", dispositif.get_dispositif);
router.post("/count_dispositifs", dispositif.count_dispositifs);
router.post("/getDispositifs", getDispositifs);
router.get("/getAllDispositifs", getAllDispositifs);
// @ts-ignore FIXME
router.post("/updateDispositifStatus", checkToken.check, updateDispositifStatus);
// @ts-ignore FIXME
router.post("/modifyDispositifMainSponsor", checkToken.check, modifyDispositifMainSponsor);
// @ts-ignore FIXME
router.post("/updateDispositifAdminComments", checkToken.check, updateDispositifAdminComments);
router.get("/getNbDispositifsByRegion", getNbDispositifsByRegion);
router.post("/updateNbVuesOrFavoritesOnContent", updateNbVuesOrFavoritesOnContent);
// @ts-ignore FIXME
router.post("/updateDispositifReactions", checkToken.getId, updateDispositifReactions);
router.get("/getUserContributions", checkToken.check, getUserContributions);
// @ts-ignore FIXME
router.get("/getDispositifsWithTranslationAvancement", checkToken.check, getDispositifsWithTranslationAvancement);
router.post("/exportFiches", exportFiches);
router.post("/exportDispositifsGeolocalisation", exportDispositifsGeolocalisation);
router.get("/getContentsForApp", getContentsForApp);
// @ts-ignore FIXME
router.post("/updateDispositifTagsOrNeeds", checkToken.check, updateDispositifTagsOrNeeds);
router.get("/getContentById", getContentById);
router.get("/getNbContents", getNbContents);
router.get("/statistics", getStatistics);
// @ts-ignore FIXME
router.patch("/:id", checkToken.check, updateDispositif);

module.exports = router;
