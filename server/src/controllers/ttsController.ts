import {
  Controller,
  Post,
  Route,
  Body,
  Security
} from "tsoa";

import { getTts, Tts } from "../workflows/tts/getTts";
import { ResponseWithData } from "../types/interface";

export interface TtsParams {
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
    @Body() body: TtsParams
  ): ResponseWithData<Tts> {
    return getTts(body);
  }
}
