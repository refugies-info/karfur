import { Controller, Post, Route, Body, Security } from "tsoa";
import { TtsRequest } from "api-types";

import { getTts } from "../workflows/tts/getTts";
import { ResponseWithData } from "../types/interface";

@Route("tts")
export class TtsController extends Controller {
  @Security({
    fromSite: [],
  })
  @Post("/")
  public async post(@Body() body: TtsRequest): ResponseWithData<any> {
    return getTts(body);
  }
}
