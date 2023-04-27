import { Controller, Get, Route, Path, Query, Security, Queries, Patch, Body, Request, Post, Put, Delete } from "tsoa";
import express from "express";
import {
  AddSuggestionDispositifRequest,
  AddViewsRequest,
  AdminCommentsRequest,
  CountDispositifsRequest,
  CreateDispositifRequest,
  DispositifStatusRequest,
  DispositifThemeNeedsRequest,
  GetAllDispositifsResponse,
  GetContentsForAppRequest,
  GetContentsForAppResponse,
  GetCountDispositifsResponse,
  GetDispositifResponse,
  GetDispositifsRequest,
  GetDispositifsResponse,
  GetDispositifsWithTranslationAvancementResponse,
  GetNbContentsForCountyRequest,
  GetNbContentsForCountyResponse,
  GetRegionStatisticsResponse,
  GetStatisticsRequest,
  GetStatisticsResponse,
  GetUserContributionsResponse,
  Languages,
  MainSponsorRequest,
  PostDispositifsResponse,
  PublishDispositifRequest,
  ReadSuggestionDispositifRequest,
  StructureReceiveDispositifRequest,
  UpdateDispositifPropertiesRequest,
  UpdateDispositifRequest,
} from "@refugies-info/api-types";
import {
  addMerci,
  addSuggestion,
  createDispositif,
  deleteDispositif,
  deleteMerci,
  deleteSuggestion,
  exportDispositifsGeolocalisation,
  exportFiches,
  getAllDispositifs,
  getContentById,
  getContentsForApp,
  getCountDispositifs,
  getDispositifs,
  getDispositifsWithTranslationAvancement,
  getNbContentsForCounty,
  getNbDispositifsByRegion,
  getStatistics,
  getUserContributions,
  modifyDispositifMainSponsor,
  patchSuggestion,
  publishDispositif,
  structureReceiveDispositif,
  updateDispositif,
  updateDispositifAdminComments,
  updateDispositifProperties,
  updateDispositifStatus,
  updateDispositifTagsOrNeeds,
  updateNbVuesOrFavoritesOnContent,
} from "../workflows";
import logger from "../logger";
import { Response, ResponseWithData } from "../types/interface";

@Route("dispositifs")
export class DispositifController extends Controller {
  @Get("/")
  public async get(@Queries() query: GetDispositifsRequest): ResponseWithData<GetDispositifsResponse[]> {
    return getDispositifs(query);
  }

  // TODO use / ?
  @Get("/getContentsForApp")
  public async getContentsForApp(
    @Queries() queries: GetContentsForAppRequest,
  ): ResponseWithData<GetContentsForAppResponse> {
    return getContentsForApp(queries).then((data) => ({ text: "success", data }));
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Post("/")
  public async createDispositif(
    @Body() body: CreateDispositifRequest,
    @Request() request: express.Request,
  ): ResponseWithData<PostDispositifsResponse> {
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

  @Get("/getNbContentsForCounty")
  public async getNbContentsForCounty(
    @Queries() queries: GetNbContentsForCountyRequest,
  ): ResponseWithData<GetNbContentsForCountyResponse> {
    logger.info("[getNbContentsForCounty]", {
      queries,
    });
    return getNbContentsForCounty(queries.county).then((data) => ({ text: "success", data }));
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
  public async publishDispositif(
    @Path() id: string,
    @Body() body: PublishDispositifRequest,
    @Request() request: express.Request,
  ): Response {
    return publishDispositif(id, body, request.user);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Patch("/{id}/structure-receive")
  public async structureReceiveDispositif(
    @Path() id: string,
    @Body() body: StructureReceiveDispositifRequest,
    @Request() request: express.Request,
  ): Response {
    return structureReceiveDispositif(id, body, request.user);
  }

  @Security({
    fromSite: [],
  })
  @Post("/{id}/views")
  public async addViewOrFavorite(@Path() id: string, @Body() types: AddViewsRequest): Response {
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
  public async addSuggestion(
    @Path() id: string,
    @Body() body: AddSuggestionDispositifRequest,
    @Request() request: express.Request,
  ): Response {
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
    @Request() request: express.Request,
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
    jwt: ["optional"],
    fromSite: [],
  })
  @Get("/{id}")
  public async getById(@Path() id: string, @Query() locale: Languages, @Request() request: express.Request): ResponseWithData<GetDispositifResponse> {
    return getContentById(id, locale, request.user);
  }
}
