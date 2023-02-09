import {
  Controller,
  Post,
  Body,
  Route,
  Security
} from "tsoa";

/* TODO: update workflows */
import { downloadApp } from "../workflows/sms/downloadApp";
import { contentLink } from "../workflows/sms/contentLink";

import { Response } from "../types/interface";

export interface DownloadAppRequest {
  phone: string;
  locale: string;
}

export interface ContentLinkRequest {
  phone: string;
  title: string;
  url: string;
}

@Route("sms")
export class SmsController extends Controller {
  @Post("/download-app")
  public async downloadApp(
    @Body() body: DownloadAppRequest
  ): Response {
    return downloadApp(body);
  }

  @Security({
    fromSite: []
  })
  @Post("/content-link")
  public async contentLink(
    @Body() body: ContentLinkRequest
  ): Response {
    return contentLink(body);
  }
}
