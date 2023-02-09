import {
  Controller,
  Post,
  Route,
  Body,
  Security
} from "tsoa";

import { getTts, GetTtsResponse } from "../workflows/tts/getTts";
import { ResponseWithData } from "../types/interface";

export interface TtsRequest {
  text: string;
  locale: string;
}

@Route("tts")
export class TtsController extends Controller {
  @Security({
    fromSite: [],
  })
  @Post("/")
  public async get(
    @Body() body: TtsRequest
  ): ResponseWithData<GetTtsResponse> {
    return getTts(body);
  }
}
