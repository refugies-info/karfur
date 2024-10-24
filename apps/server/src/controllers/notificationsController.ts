import {
  AppUserUid,
  GetNotificationResponse,
  MarkAsSeenRequest,
  SendNotificationsRequest,
} from "@refugies-info/api-types";
import * as express from "express";
import { Body, Controller, Get, Header, Post, Request, Route, Security } from "tsoa";

import { Response, ResponseWithData } from "~/types/interface";
import { getNotifications } from "~/workflows/notifications/getNotifications";
import { markAsSeen } from "~/workflows/notifications/markAsSeen";
import { sendNotifications } from "~/workflows/notifications/sendNotifications";

@Route("notifications")
export class NotificationController extends Controller {
  @Get("/")
  public async get(@Header("x-app-uid") appUid: AppUserUid): ResponseWithData<GetNotificationResponse> {
    return getNotifications(appUid);
  }

  @Post("/seen")
  public async seen(@Header("x-app-uid") appUid: AppUserUid, @Body() body: MarkAsSeenRequest): Response {
    return markAsSeen(appUid, body);
  }

  @Security({
    jwt: ["admin"],
  })
  @Post("/send")
  public async send(@Body() body: SendNotificationsRequest, @Request() request: express.Request): Response {
    return sendNotifications(body, request.userId);
  }
}
