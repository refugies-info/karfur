import { Controller, Get, Route, Path, Query, Security, Queries, Patch, Body, Request, Post, Put, Delete } from "tsoa";
import {
  AddViewsRequest,
  AdminCommentsRequest,
  CountDispositifsRequest,
  CreateDispositifRequest,
  DispositifStatusRequest,
  GetDispositifsRequest,
  GetStatisticsRequest,
  MainSponsorRequest,
  UpdateDispositifPropertiesRequest,
  UpdateDispositifRequest,
  GetDispositifsResponse,
  GetAllDispositifsResponse,
  GetDispositifResponse,
  GetStatisticsResponse,
  GetCountDispositifsResponse,
  GetUserContributionsResponse,
  GetDispositifsWithTranslationAvancementResponse,
  Languages,
  AddSuggestionDispositifRequest,
  ReadSuggestionDispositifRequest,
  GetRegionStatisticsResponse,
  PostDispositifsResponse,
  PublishDispositifRequest,
  StructureReceiveDispositifRequest,
  DispositifThemeNeedsRequest,
} from "api-types";
import express, { Request as ExRequest } from "express";

import { updateNbVuesOrFavoritesOnContent } from "../workflows/dispositif/updateNbVuesOrFavoritesOnContent";
import { getDispositifs } from "../workflows/dispositif/getDispositifs";
import { getAllDispositifs } from "../workflows/dispositif/getAllDispositifs";
import { updateDispositifStatus } from "../workflows/dispositif/updateDispositifStatus";
import { modifyDispositifMainSponsor } from "../workflows/dispositif/modifyDispositifMainSponsor";
import { updateDispositifAdminComments } from "../workflows/dispositif/updateDispositifAdminComments";
import { getNbDispositifsByRegion } from "../workflows/dispositif/getNbDispositifsByRegion";
import { getUserContributions } from "../workflows/dispositif/getUserContributions";
import { getDispositifsWithTranslationAvancement } from "../workflows/dispositif/getDispositifsWithTranslationAvancement";
import { exportFiches } from "../workflows/dispositif/exportFiches";
import { exportDispositifsGeolocalisation } from "../workflows/dispositif/exportDispositifsGeolocalisation";
import { getContentsForApp } from "../workflows/dispositif/getContentsForApp";
import { updateDispositifTagsOrNeeds } from "../workflows/dispositif/updateDispositifTagsOrNeeds";
import { getContentById } from "../workflows/dispositif/getContentById";
import { getStatistics } from "../workflows/dispositif/getStatistics";
import { Response, ResponseWithData } from "../types/interface";
import { getCountDispositifs } from "../workflows/dispositif/getCountDispositifs";
import { updateDispositifProperties } from "../workflows/dispositif/updateDispositifProperties";
import { updateDispositif } from "../workflows/dispositif/updateDispositif";
import { createDispositif } from "../workflows/dispositif/createDispositif";
import { addMerci } from "../workflows/dispositif/addMerci";
import { deleteMerci } from "../workflows/dispositif/deleteMerci";
import { addSuggestion } from "../workflows/dispositif/addSuggestion";
import { patchSuggestion } from "../workflows/dispositif/patchSuggestion";
import { deleteSuggestion } from "../workflows/dispositif/deleteSuggestion";
import { publishDispositif } from "../workflows/dispositif/publishDispositif";
import { deleteDispositif } from "../workflows/dispositif/deleteDispositif";
import { structureReceiveDispositif } from "../workflows/dispositif/structureReceiveDispositif";

const router = express.Router();

/* TODO: use tsoa */
router.get("/getContentsForApp", getContentsForApp);

export { router };

@Route("dispositifs")
export class DispositifController extends Controller {
  @Get("/")
  public async get(@Queries() query: GetDispositifsRequest): ResponseWithData<GetDispositifsResponse[]> {
    return getDispositifs(query);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Post("/")
  public async createDispositif(@Body() body: CreateDispositifRequest, @Request() request: express.Request): ResponseWithData<PostDispositifsResponse> {
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
  public async getStatistics(@Queries() query: GetStatisticsRequest): ResponseWithData<GetStatisticsResponse> {
    return getStatistics(query);
  }

  @Security("jwt")
  @Get("/region-statistics")
  public async getRegionStatistics(): ResponseWithData<GetRegionStatisticsResponse> {
    return getNbDispositifsByRegion();
  }

  @Security({
    jwt: ["admin"],
  })
  @Get("/count")
  public async getCount(@Queries() query: CountDispositifsRequest): ResponseWithData<GetCountDispositifsResponse> {
    return getCountDispositifs(query);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Get("/user-contributions")
  public async getUserContributions(
    @Request() request: express.Request,
  ): ResponseWithData<GetUserContributionsResponse[]> {
    return getUserContributions(request.userId);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Get("/with-translations-status")
  public async withTranslationsStatus(
    @Query("locale") locale: Languages,
  ): ResponseWithData<GetDispositifsWithTranslationAvancementResponse[]> {
    return getDispositifsWithTranslationAvancement(locale).then((data) => ({
      text: "success",
      data,
    }));
  }

  // export
  @Security({
    fromSite: [],
  })
  @Post("/export")
  public async export(): Response {
    return exportFiches();
  }
  @Post("/export-geoloc")
  public async exportGeolocalisation(): Response {
    return exportDispositifsGeolocalisation();
  }

  // updates
  @Security({
    jwt: [],
    fromSite: [],
  })
  @Patch("/{id}/publish")
  public async publishDispositif(@Path() id: string, @Body() body: PublishDispositifRequest, @Request() request: express.Request): Response {
    return publishDispositif(id, body, request.user);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Patch("/{id}/structure-receive")
  public async structureReceiveDispositif(@Path() id: string, @Body() body: StructureReceiveDispositifRequest, @Request() request: express.Request): Response {
    return structureReceiveDispositif(id, body, request.user);
  }

  @Security({
    fromSite: [],
  })
  @Post("/{id}/views")
  public async addViewOrFavorite(@Path() id: string, @Body() types: AddViewsRequest): Response {
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
    @Request() request: express.Request,
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
    @Request() request: express.Request,
  ): Response {
    return modifyDispositifMainSponsor(id, body, request.userId);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Patch("/{id}/properties")
  public async updateProperties(@Path() id: string, @Body() body: UpdateDispositifPropertiesRequest): Response {
    return updateDispositifProperties(id, body);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Patch("/{id}/status")
  public async updateStatus(
    @Path() id: string,
    @Body() body: DispositifStatusRequest,
    @Request() request: express.Request,
  ): Response {
    return updateDispositifStatus(id, body, request.user);
  }
  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Patch("/{id}/themes-needs")
  public async updateThemeNeeds(
    @Path() id: string,
    @Body() body: DispositifThemeNeedsRequest,
    @Request() request: express.Request,
  ): Response {
    return updateDispositifTagsOrNeeds(id, body, request.user);
  }

  // reactions
  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Put("/{id}/merci")
  public async addMerci(@Path() id: string, @Request() request: express.Request): Response {
    return addMerci(id, request.userId);
  }
  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Delete("/{id}/merci")
  public async deleteMerci(@Path() id: string, @Request() request: express.Request): Response {
    return deleteMerci(id, request.userId);
  }
  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Put("/{id}/suggestion")
  public async addSuggestion(@Path() id: string, @Body() body: AddSuggestionDispositifRequest, @Request() request: express.Request): Response {
    return addSuggestion(id, body, request.userId);
  }
  @Security({
    jwt: [""],
    fromSite: [],
  })
  @Patch("/{id}/suggestion")
  public async updateSuggestion(@Path() id: string, @Body() body: ReadSuggestionDispositifRequest): Response {
    return patchSuggestion(id, body);
  }
  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Delete("/{id}/suggestion/{suggestionId}")
  public async deleteSuggestion(@Path() id: string, @Path() suggestionId: string): Response {
    return deleteSuggestion(id, suggestionId);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Patch("/{id}")
  public async update(
    @Path() id: string,
    @Body() body: UpdateDispositifRequest,
    @Request() request: ExRequest,
  ): Response {
    return updateDispositif(id, body, request.user);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Delete("/{id}")
  public async deleteDispositif(@Path() id: string, @Request() request: express.Request): Response {
    return deleteDispositif(id, request.user);
  }

  // keep in last position to make sure /xyz routes are catched before
  @Security({
    fromSite: [],
  })
  @Get("/{id}") // TODO: moved from getContentById?contentId (app)
  public async getById(@Path() id: string, @Query() locale: Languages): ResponseWithData<GetDispositifResponse> {
    return getContentById(id, locale);
  }
}
