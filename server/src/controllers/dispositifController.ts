import { Controller, Get, Route, Path, Query, Security, Queries, Patch, Body, Request, Post } from "tsoa";
import express, { Request as ExRequest } from "express";

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
import { exportDispositifsGeolocalisation } from "../workflows/dispositif/exportDispositifsGeolocalisation";
import { getContentsForApp } from "../workflows/dispositif/getContentsForApp";
import { updateDispositifTagsOrNeeds } from "../workflows/dispositif/updateDispositifTagsOrNeeds";
import { getContentById, GetDispositifResponse } from "../workflows/dispositif/getContentById";
import { getStatistics, GetStatisticsResponse } from "../workflows/dispositif/getStatistics";
import { InfoSection, Metadatas, Response, ResponseWithData } from "../types/interface";
import { Languages } from "../typegoose";
import { getCountDispositifs, GetCountDispositifsResponse } from "../workflows/dispositif/getCountDispositifs";
import { GetUserContributionsResponse } from "../workflows/dispositif/getUserContributions/getUserContributions";
import { updateDispositifProperties } from "../workflows/dispositif/updateDispositifProperties";
import { updateDispositif } from "../workflows/dispositif/updateDispositif";
import { createDispositif } from "../workflows/dispositif/createDispositif";

const router = express.Router();

/* TODO: use tsoa */
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

export interface MainSponsorRequest {
  sponsorId: string;
}

export interface DispositifStatusRequest {
  status: "Actif" | "Supprimé" | "Brouillon" | "En attente" | "En attente admin" | "En attente non prioritaire"; // TODO: type
}

export interface AddViewsRequest {
  types: ViewsType[]
}

export interface UpdateDispositifPropertiesRequest {
  webOnly: boolean;
}

interface DispositifRequest {
  titreInformatif?: string;
  titreMarque?: string;
  abstract?: string;
  what?: string;
  why?: { [key: string]: InfoSection };
  how?: { [key: string]: InfoSection };
  next?: { [key: string]: InfoSection };
  mainSponsor?: string;
  theme?: string;
  secondaryThemes?: string[];
  // sponsors?: (Sponsor | SponsorDB)[];
  metadatas?: Metadatas;
  // map: Poi[];
}
export interface UpdateDispositifRequest extends DispositifRequest { }
export interface CreateDispositifRequest extends DispositifRequest {
  typeContenu: "dispositif" | "demarche";
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
    jwt: [],
    fromSite: [],
  })
  @Post("/")
  public async createDispositif(
    @Body() body: CreateDispositifRequest,
    @Request() request: express.Request
  ): Response {
    return createDispositif(body, request.userId);
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
    jwt: [],
    fromSite: [],
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
    // TODO: change in app
    return updateNbVuesOrFavoritesOnContent(id, types);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Patch("/{id}/admin-comments")
  public async updateAdminComments(
    @Path() id: string,
    @Body() body: AdminCommentsRequest,
    @Request() request: express.Request
  ): Response {
    return updateDispositifAdminComments(id, body, request.userId);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Patch("/{id}/main-sponsor")
  public async updateMainSponsor(
    @Path() id: string,
    @Body() body: MainSponsorRequest,
    @Request() request: express.Request
  ): Response {
    return modifyDispositifMainSponsor(id, body, request.userId);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Patch("/{id}/properties")
  public async updateProperties(
    @Path() id: string,
    @Body() body: UpdateDispositifPropertiesRequest
  ): Response {
    return updateDispositifProperties(id, body);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Patch("/{id}/status")
  public async updateStatus(
    @Path() id: string,
    @Body() body: DispositifStatusRequest,
    @Request() request: express.Request
  ): Response {
    return updateDispositifStatus(id, body, request.user);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Patch("/{id}")
  public async update(
    @Path() id: string,
    @Body() body: UpdateDispositifRequest,
    @Request() request: ExRequest
  ): Response {
    return updateDispositif(id, body, request.user);
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


