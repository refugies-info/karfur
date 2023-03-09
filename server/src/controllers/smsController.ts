import { Controller, Post, Body, Route, Security } from "tsoa";
import { ContentLinkRequest, DownloadAppRequest } from "api-types";

import { downloadApp } from "../workflows/sms/downloadApp";
import { contentLink } from "../workflows/sms/contentLink";
import { Response } from "../types/interface";

@Route("sms")
export class SmsController extends Controller {
  @Post("/download-app")
  public async downloadApp(@Body() body: DownloadAppRequest): Response {
    return downloadApp(body);
  }

  @Security({
    fromSite: [],
  })
  @Post("/content-link")
  public async contentLink(@Body() body: ContentLinkRequest): Response {
    return contentLink(body);
  }
}
