import { Controller, Get, Post, Body, Route, Security, Header, Request } from "tsoa";
import * as express from "express";
import { getNotifications, GetNotificationResponse } from "../workflows/notifications/getNotifications";
import { markAsSeen } from "../workflows/notifications/markAsSeen";
import { sendNotifications } from "../workflows/notifications/sendNotifications";
import { Response, ResponseWithData } from "../types/interface";

/**
 * TODO: test pattern
 * @pattern [0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}
 */
export type Uid = string;

export interface MarkAsSeenRequest {
  notificationId: string;
}

export interface SendNotificationsRequest {
  demarcheId: string;
}

@Route("notifications")
export class NotificationController extends Controller {
  @Get("/")
  public async get(@Header("x-app-uid") appUid: Uid): ResponseWithData<GetNotificationResponse> {
    return getNotifications(appUid);
  }

  @Post("/seen")
  public async seen(@Header("x-app-uid") appUid: Uid, @Body() body: MarkAsSeenRequest): Response {
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
