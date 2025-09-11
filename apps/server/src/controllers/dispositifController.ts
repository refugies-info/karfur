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
  GetDispositifsHasTextChanges,
  GetDispositifsRequest,
  GetDispositifsWithTranslationAvancementResponse,
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
  SimpleDispositif,
  StructureReceiveDispositifRequest,
  UpdateDispositifPropertiesRequest,
  UpdateDispositifRequest,
  UpdateDispositifResponse,
} from "@refugies-info/api-types";
import express from "express";
import { Body, Controller, Delete, Get, Patch, Path, Post, Put, Queries, Query, Request, Route, Security } from "tsoa";
import { validateId } from "~/libs/validateId";
import logger from "~/logger";
import { Response, ResponseWithData } from "~/types/interface";

import {
  addAvis,
  addMerci,
  addSuggestion,
  createDispositif,
  deleteAvis,
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
  getHasTextChanges,
  getNbContentsForCounty,
  getNbDispositifsByRegion,
  getNewsletterDemarches,
  getNewsletterDispositifs,
  getStatistics,
  getUserContributions,
  modifyDispositifMainSponsor,
  patchSuggestion,
  publishDispositif,
  structureReceiveDispositif,
  updateAvis,
  updateDispositif,
  updateDispositifAdminComments,
  updateDispositifProperties,
  updateDispositifStatus,
  updateDispositifTagsOrNeeds,
  updateNbVuesOrFavoritesOnContent,
} from "~/workflows";
import { DemarchesData, DispositifsData } from "~/workflows/dispositif/newsletter";

@Route("dispositifs")
export class DispositifController extends Controller {
  @Get("/")
  public async get(@Queries() query: GetDispositifsRequest): ResponseWithData<SimpleDispositif[]> {
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

  @Security({
    jwt: ["admin"],
  })
  @Get("/region-statistics")
  public async getRegionStatistics(): ResponseWithData<GetRegionStatisticsResponse> {
    return getNbDispositifsByRegion();
  }

  @Get("/getNbContentsForCounty")
  public async getNbContentsForCounty(
    @Queries() queries: GetContentsForAppRequest,
  ): ResponseWithData<GetNbContentsForCountyResponse> {
    logger.info("[getNbContentsForCounty]", {
      queries,
    });
    return getNbContentsForCounty(queries).then((data) => ({ text: "success", data }));
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
    jwt: ["admin"],
    fromSite: [],
  })
  @Post("/export")
  public async export(): Response {
    return exportFiches();
  }

  @Security({
    jwt: ["admin"],
  })
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
    validateId(id, "dispositif");
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
    validateId(id, "dispositif");
    return structureReceiveDispositif(id, body, request.user);
  }

  @Security({
    fromSite: [],
  })
  @Post("/{id}/views")
  public async addViewOrFavorite(@Path() id: string, @Body() types: AddViewsRequest): Response {
    validateId(id, "dispositif");
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
    validateId(id, "dispositif");
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
    validateId(id, "dispositif");
    return modifyDispositifMainSponsor(id, body, request.userId);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Patch("/{id}/properties")
  public async updateProperties(@Path() id: string, @Body() body: UpdateDispositifPropertiesRequest): Response {
    validateId(id, "dispositif");
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
    validateId(id, "dispositif");
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
    validateId(id, "dispositif");
    return updateDispositifTagsOrNeeds(id, body, request.user);
  }

  // reactions
  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Put("/{id}/merci")
  public async addMerci(@Path() id: string, @Request() request: express.Request): Response {
    validateId(id, "dispositif");
    return addMerci(id, request.userId);
  }

  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Delete("/{id}/merci")
  public async deleteMerci(@Path() id: string, @Request() request: express.Request): Response {
    validateId(id, "dispositif");
    return deleteMerci(id, request.userId);
  }
  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Put("/{id}/avis")
  public async addAvis(
    @Path() id: string,
    @Body() body: { avis: boolean; anonymousUserId?: string; language?: string; userId?: string },
    @Request() request: express.Request,
  ): Response {
    validateId(id, "dispositif");
    const userId = request.userId || body.userId || undefined;
    const anonymousUserId = userId ? undefined : body.anonymousUserId || undefined;
    const language = body.language || "fr";

    if (userId === undefined && anonymousUserId === undefined) {
      this.setStatus(403);
      return { text: "error" };
    }

    return addAvis(id, userId, anonymousUserId, body.avis, language);
  }
  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Delete("/{id}/avis")
  public async deleteAvis(
    @Path() id: string,
    @Body() body: { userId?: string; anonymousUserId?: string },
    @Request() request: express.Request,
  ): Response {
    validateId(id, "dispositif");
    const userId = request.userId || body.userId || undefined;
    const anonymousUserId = userId ? undefined : body.anonymousUserId || undefined;

    if (userId === undefined && anonymousUserId === undefined) {
      this.setStatus(403);
      return { text: "error" };
    }

    return deleteAvis(id, userId, anonymousUserId);
  }
  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Patch("/{id}/avis")
  public async updateAvis(
    @Path() id: string,
    @Body() body: { avis: boolean; anonymousUserId?: string; language?: string; userId?: string },
    @Request() request: express.Request,
  ): Response {
    validateId(id, "dispositif");
    const userId = request.userId || body.userId || undefined;
    const anonymousUserId = userId ? undefined : body.anonymousUserId || undefined;
    const language = body.language || "fr";

    if (userId === undefined && anonymousUserId === undefined) {
      this.setStatus(403);
      return { text: "error" };
    }

    return updateAvis(id, userId, anonymousUserId, body.avis, language);
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
    validateId(id, "dispositif");
    return addSuggestion(id, body, request.userId);
  }
  @Security({
    jwt: [""],
    fromSite: [],
  })
  @Patch("/{id}/suggestion")
  public async updateSuggestion(@Path() id: string, @Body() body: ReadSuggestionDispositifRequest): Response {
    validateId(id, "dispositif");
    return patchSuggestion(id, body);
  }
  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Delete("/{id}/suggestion/{suggestionId}")
  public async deleteSuggestion(@Path() id: string, @Path() suggestionId: string): Response {
    validateId(id, "dispositif");
    validateId(suggestionId, "suggestion");
    return deleteSuggestion(id, suggestionId);
  }

  @Security({
    jwt: ["newsletter"],
    fromSite: [],
  })
  @Get("/newsletter/demarches")
  public async getNewsletterDemarches(): ResponseWithData<DemarchesData> {
    return getNewsletterDemarches();
  }

  @Security({
    jwt: ["newsletter"],
    fromSite: [],
  })
  @Get("/newsletter/dispositifs/{departement}")
  public async getNewsletterDispositifs(@Path() departement: string): ResponseWithData<DispositifsData> {
    return getNewsletterDispositifs(departement);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Get("/{id}/has-text-changes")
  public async getHasChanges(@Path() id: string): ResponseWithData<GetDispositifsHasTextChanges> {
    return getHasTextChanges(id).then((res) => ({ text: "success", data: res }));
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
  ): ResponseWithData<UpdateDispositifResponse> {
    validateId(id, "dispositif");
    return updateDispositif(id, body, request.user);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Delete("/{id}")
  public async deleteDispositif(@Path() id: string, @Request() request: express.Request): Response {
    validateId(id, "dispositif");
    return deleteDispositif(id, request.user);
  }

  // keep in last position to make sure /xyz routes are catched before
  @Security({
    jwt: ["optional"],
    fromSite: [],
  })
  @Get("/{id}")
  public async getById(
    @Path() id: string,
    @Query() locale: Languages,
    @Request() request: express.Request,
  ): ResponseWithData<GetDispositifResponse> {
    validateId(id, "dispositif");
    return getContentById(id, locale, request.user);
  }
}
