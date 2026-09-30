import type {
  ContentLinkRequest,
  CourseListLinkRequest,
  DownloadAppRequest,
} from "@refugies-info/api-types";
import { Body, Controller, Post, Route, Security } from "tsoa";

import type { Response } from "~/types/interface";
import { contentLink } from "~/workflows/sms/contentLink";
import { courseListLink } from "~/workflows/sms/courseListLink";
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

  @Security({
    fromSite: [],
  })
  @Post("/course-list-link")
  public async courseListLink(@Body() body: CourseListLinkRequest): Response {
    return courseListLink(body);
  }
}
