import { TtsRequest } from "@refugies-info/api-types";
import { Body, Controller, Post, Route, Security } from "tsoa";
import { getTts } from "~/workflows/tts/getTts";

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
