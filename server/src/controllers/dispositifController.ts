import {
  Controller,
  Get,
  Route,
  Path,
  Query,
  Security,
  Queries
} from "tsoa";

import express from "express";
import * as dispositif from "./dispositif/lib";
import * as checkToken from "./account/checkToken";

import { updateNbVuesOrFavoritesOnContent } from "../workflows/dispositif/updateNbVuesOrFavoritesOnContent";
import { getDispositifs, GetDispositifsResponse } from "../workflows/dispositif/getDispositifs";
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
import { getContentById, GetDispositifResponse } from "../workflows/dispositif/getContentById";
import { getStatistics, GetStatisticsResponse } from "../workflows/dispositif/getStatistics";
import updateDispositif from "../workflows/dispositif/updateDispositif";
import { ResponseWithData } from "../types/interface";
import { Languages } from "../typegoose";

const router = express.Router();

/* TODO: use tsoa */

// @ts-ignore FIXME
router.post("/addDispositif", checkToken.getId, checkToken.check, addDispositif);
router.post("/add_dispositif_infocards", checkToken.check, dispositif.add_dispositif_infocards);
router.post("/get_dispositif", dispositif.get_dispositif);
router.post("/count_dispositifs", dispositif.count_dispositifs);
// @ts-ignore FIXME
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
// router.get("/getContentById", getContentById);
// @ts-ignore FIXME
router.patch("/:id", checkToken.check, updateDispositif);

export { router };

type Facets = "nbMercis" | "nbVues" | "nbVuesMobile" | "nbDispositifs" | "nbDemarches" | "nbUpdatedRecently";

export interface GetDispositifsRequest {
  type?: "dispositif" | "demarche"; // TODO: type
  locale: string
  limit?: number
  sort?: string
}
export interface GetStatisticsRequest {
  facets?: Facets[]
}

@Route("dispositifs")
export class DispositifController extends Controller {
  @Get("/")
  public async get(
    @Queries() query: GetDispositifsRequest
  ): ResponseWithData<GetDispositifsResponse[]> {
    return getDispositifs(query);
  }

  @Get("/statistics")
  public async getStatistics(
    @Queries() query: GetStatisticsRequest
  ): ResponseWithData<GetStatisticsResponse> {
    return getStatistics(query);
  }

  // keep in last position to make sure /xyz routes are catched before
  @Security({
    fromSite: [],
  })
  @Get("/{id}") // TODO: moved from getContentById?contentId (app)
  public async getById(
    @Path() id: string,
    @Query() locale: Languages
  ): ResponseWithData<GetDispositifResponse> {
    return getContentById(id, locale);
  }
}


