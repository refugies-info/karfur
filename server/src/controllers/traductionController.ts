import express from "express";
import { Body, Controller, Get, Post, Query, Request, Route, Security } from "tsoa";

import * as traduction from "./traduction/lib";
import * as checkToken from "./account/checkToken";
import { IRequest, ResponseWithData } from "../types/interface";
import {
  getDefaultTraduction,
  getStatistics,
  getTraductionsForReview,
  saveTranslation,
  SaveTranslationRequest,
  translate,
  validateTranslations,
} from "src/workflows";
import { Dispositif, TranslationContent } from "src/typegoose/Dispositif";
import { Languages } from "src/typegoose";
import { TraductionsType } from "src/typegoose/Traductions";

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

export { router };

export interface GetTraductionsForReview {
  author: string;
  translated: Partial<TranslationContent>;
  username: string;
}
export type GetTraductionsForReviewResponse = GetTraductionsForReview[];

export interface TranslateRequest {
  q: string;
  language: Languages;
}

export interface SaveTranslationResponse {
  translation: {
    dispositifId: string;
    userId: string;
    language: Languages;
    translated: Partial<TranslationContent>;
    // public validatorId: Ref<User>;
    timeSpent: number;
    avancement: number;
    toReview?: string[];
    type: TraductionsType;
    created_at: Date;
    updatedAt: Date;
  };
}

export interface GetDefaultTraductionResponse {
  translation: Dispositif["translations"]["fr"];
}

@Route("traduction")
export class TranslationController extends Controller {
  @Post("/")
  @Security("jwt")
  public saveTranslation(
    @Body() body: SaveTranslationRequest,
    @Request() request: IRequest,
  ): ResponseWithData<SaveTranslationResponse> {
    return saveTranslation(body, request.user).then((translation) => {
      console.log(translation);
      return {
        text: "success",
        data: {
          translation: {
            ...translation,
            dispositifId: translation.dispositifId.toString(),
            userId: translation.userId.toString(),
          },
        },
      };
    });
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
}
