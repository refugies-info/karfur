import { ContentLinkRequest, DownloadAppRequest } from "@refugies-info/api-types";
import { Body, Controller, Post, Route, Security } from "tsoa";

import { Response } from "~/types/interface";
import { contentLink } from "~/workflows/sms/contentLink";
import { downloadApp } from "~/workflows/sms/downloadApp";

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
