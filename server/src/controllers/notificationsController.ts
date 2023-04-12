import { Controller, Get, Post, Body, Route, Security, Header, Request } from "tsoa";
import { AppUserUid, GetNotificationResponse, MarkAsSeenRequest, SendNotificationsRequest } from "api-types";
import * as express from "express";

import { getNotifications } from "../workflows/notifications/getNotifications";
import { markAsSeen } from "../workflows/notifications/markAsSeen";
import { sendNotifications } from "../workflows/notifications/sendNotifications";
import { Response, ResponseWithData } from "../types/interface";

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
