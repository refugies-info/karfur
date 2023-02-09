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


@Route("sms")
export class SmsController extends Controller {
  @Post("/download-app")
  public async downloadApp(
    @Body() body: { phone: string, locale: string }
  ): Response {
    return downloadApp(body);
  }

  @Security({
    fromSite: []
  })
  @Post("/content-link")
  public async contentLink(
    @Body() body: { phone: string, title: string, url: string }
  ): Response {
    return contentLink(body);
  }
}
