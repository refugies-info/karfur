import { Body, Controller, Delete, Get, Post, Queries, Query, Request, Route, Security } from "tsoa";

import { IRequest, ResponseWithData } from "../types/interface";
import {
  deleteTranslations,
  getDefaultTraduction,
  getProgression,
  getTranslationStatistics,
  getTraductionsForReview,
  saveTranslation,
  translate,
} from "../workflows";
import {
  DeleteTranslationsRequest,
  GetDefaultTraductionResponse,
  GetProgressionRequest,
  GetProgressionResponse,
  GetTraductionsForReviewResponse,
  Languages,
  SaveTranslationRequest,
  SaveTranslationResponse,
  TranslateRequest,
  TranslationStatisticsRequest,
  TranslationStatisticsResponse,
} from "@refugies-info/api-types";
import logger from "../logger";

@Route("traduction")
export class TranslationController extends Controller {
  @Post("/")
  @Security("jwt")
  public saveTranslation(
    @Body() body: SaveTranslationRequest,
    @Request() request: IRequest,
  ): ResponseWithData<SaveTranslationResponse> {
    return saveTranslation(body, request.user).then((translation) => ({
      text: "success",
      data: {
        translation: {
          ...translation,
          dispositifId: translation.dispositifId.toString(),
          userId: translation.userId.toString(),
        },
      },
    }));
  }

  /**
   * Get the default FR transalation for a Dispositif
   *
   * Used by translation page
   */
  @Get("/")
  @Security("jwt")
  public getDefaultTraduction(@Query() dispositif: string): ResponseWithData<GetDefaultTraductionResponse> {
    return getDefaultTraduction(dispositif).then((translation) => ({
      text: "success",
      data: { translation },
    }));
  }

  @Delete("/")
  @Security({ jwt: ["admin"] })
  public deleteTraductions(@Queries() queries: DeleteTranslationsRequest) {
    return deleteTranslations(queries.dispositifId, queries.locale).then(() => ({
      text: "success",
    }));
  }

  @Get("/for_review")
  @Security("jwt")
  public getTraductionsForReview(
    @Query() dispositif: string,
    @Query() language: string,
    @Request() request: IRequest,
  ): ResponseWithData<GetTraductionsForReviewResponse> {
    return getTraductionsForReview(dispositif, language as Languages, request.user).then((traductions) => ({
      text: "success",
      data: traductions.map((trad) => ({
        translated: trad.translated,
        author: trad.getUser().id,
        username: trad.getUser().username,
        toReview: trad.toReview,
      })),
    }));
  }

  /**
   * Get an automatic translation proposal
   */
  @Security({
    jwt: [], // ["trad", "tradExpert"],
    fromSite: [],
  })
  @Post("/translate")
  public translate(@Body() body: TranslateRequest): ResponseWithData<string> {
    return translate(body.q, body.language).then((translation) => ({
      text: "success",
      data: translation,
    }));
  }

  @Security("jwt")
  @Get("/get_progression")
  public getProgression(
    @Request() req: IRequest,
    @Queries() queries?: GetProgressionRequest,
  ): ResponseWithData<GetProgressionResponse> {
    logger.info("[get_progression] received");
    return getProgression(queries.userId || req.user._id).then((progression) => ({
      text: "success",
      data: progression,
    }));
  }

  @Get("/statistics")
  public getStatistics(
    @Queries() queries: TranslationStatisticsRequest,
  ): ResponseWithData<TranslationStatisticsResponse> {
    return getTranslationStatistics(queries).then((statistics) => ({
      text: "success",
      data: statistics,
    }));
  }
}
