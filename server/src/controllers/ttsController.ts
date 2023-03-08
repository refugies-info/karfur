import { Controller, Post, Route, Body, Security } from "tsoa";
import { TtsRequest } from "api-types";
import { getTts } from "../workflows/tts/getTts";

@Route("tts")
export class TtsController extends Controller {
  @Security({
    fromSite: [],
  })
  @Post("/")
  public async post(@Body() body: TtsRequest): Promise<any> {
    return getTts(body);
  }
}
