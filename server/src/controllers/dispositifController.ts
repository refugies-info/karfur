import {
  Controller,
  Get,
  Route,
  Path,
  Query,
  Security,
  Queries,
  Patch,
  Body,
  Request,
  Post
} from "tsoa";

import express from "express";
import * as dispositif from "./dispositif/lib";
import * as checkToken from "./account/checkToken";

import { updateNbVuesOrFavoritesOnContent } from "../workflows/dispositif/updateNbVuesOrFavoritesOnContent";
import { getDispositifs, GetDispositifsResponse } from "../workflows/dispositif/getDispositifs";
import { getAllDispositifs, GetAllDispositifsResponse } from "../workflows/dispositif/getAllDispositifs";
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
import { Response, ResponseWithData } from "../types/interface";
import { Languages } from "../typegoose";
import { getCountDispositifs, GetCountDispositifsResponse } from "../workflows/dispositif/getCountDispositifs";
import { GetUserContributionsResponse } from "../workflows/dispositif/getUserContributions/getUserContributions";

const router = express.Router();

/* TODO: use tsoa */

// @ts-ignore FIXME
router.post("/addDispositif", checkToken.getId, checkToken.check, addDispositif);
router.post("/add_dispositif_infocards", checkToken.check, dispositif.add_dispositif_infocards);
// @ts-ignore FIXME
router.post("/updateDispositifStatus", checkToken.check, updateDispositifStatus);
// @ts-ignore FIXME
router.post("/modifyDispositifMainSponsor", checkToken.check, modifyDispositifMainSponsor);
// @ts-ignore FIXME
router.get("/getNbDispositifsByRegion", getNbDispositifsByRegion);
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

type ViewsType = "web" | "mobile" | "favorite";
type Facets = "nbMercis" | "nbVues" | "nbVuesMobile" | "nbDispositifs" | "nbDemarches" | "nbUpdatedRecently";

export interface CountDispositifsRequest {
  type: "dispositif" | "demarche"; // TODO: type
  publishedOnly: boolean
  themeId?: string;
}

export interface GetDispositifsRequest {
  type?: "dispositif" | "demarche"; // TODO: type
  locale: string
  limit?: number
  sort?: string
}
export interface GetStatisticsRequest {
  facets?: Facets[]
}

export interface AdminCommentsRequest {
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string;
}

export interface AddViewsRequest {
  types: ViewsType[]
}


@Route("dispositifs")
export class DispositifController extends Controller {
  @Get("/")
  public async get(
    @Queries() query: GetDispositifsRequest
  ): ResponseWithData<GetDispositifsResponse[]> {
    return getDispositifs(query);
  }

  @Security({
    jwt: ["admin"],
  })
  @Get("/all")
  public async getAll(): ResponseWithData<GetAllDispositifsResponse[]> {
    return getAllDispositifs();
  }

  @Get("/statistics")
  public async getStatistics(
    @Queries() query: GetStatisticsRequest
  ): ResponseWithData<GetStatisticsResponse> {
    return getStatistics(query);
  }

  @Security({
    jwt: ["admin"],
  })
  @Get("/count")
  public async getCount(
    @Queries() query: CountDispositifsRequest
  ): ResponseWithData<GetCountDispositifsResponse> {
    return getCountDispositifs(query);
  }

  @Security({
    fromSite: [],
    jwt: [],
  })
  @Get("/user-contributions")
  public async getUserContributions(
    @Request() request: express.Request
  ): ResponseWithData<GetUserContributionsResponse[]> {
    return getUserContributions(request.userId);
  }

  @Security({
    fromSite: [],
  })
  @Post("/{id}/views")
  public async addViewOrFavorite(
    @Path() id: string,
    @Body() types: AddViewsRequest
  ): Response {
    return updateNbVuesOrFavoritesOnContent(id, types);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"],
  })
  @Patch("/{id}/admin-comments")
  public async updateAdminComments(
    @Path() id: string,
    @Body() body: AdminCommentsRequest,
    @Request() request: express.Request
  ): Response {
    return updateDispositifAdminComments(id, body, request.userId);
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


