import {
  Controller,
  Post,
  Body,
  Route,
  Security,
  Request
} from "tsoa";
import * as express from "express";
import { sendDraftReminderMail } from "../workflows/mail/sendDraftReminderMail";
import { sendReminderMailToUpdateContents } from "../workflows/mail/sendReminderMailToUpdateContents";
import { sendAdminImprovementsMail } from "../workflows/mail/sendAdminImprovementsMail";
import { sendSubscriptionReminderMail } from "../workflows/mail/sendSubscriptionReminderMail";
import { addContact } from "../workflows/mail/addContact";
import { Response } from "../types/interface";
import { DispositifId, UserId } from "../typegoose";

export interface ImprovementsRequest {
  dispositifId: DispositifId;
  users: {
    username: string;
    _id: UserId;
    email: string;
  }[];
  titreInformatif: string;
  titreMarque: string;
  sections: string[];
  message: string;
}

export interface SubscriptionRequest {
  email: string;
}

export interface AddContactRequest {
  email: string;
}

@Route("mail")
export class NeedController extends Controller {

  @Security({
    fromCron: []
  })
  @Post("sendDraftReminderMail")
  public draftReminderMail(): Response {
    return sendDraftReminderMail();
  }

  @Security({
    fromCron: []
  })
  @Post("sendReminderMailToUpdateContents")
  public reminderMailToUpdateContents(): Response {
    return sendReminderMailToUpdateContents();
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Post("sendAdminImprovementsMail")
  public adminImprovementsMail(
    @Body() body: ImprovementsRequest,
    @Request() request: express.Request
  ): Response {
    return sendAdminImprovementsMail(body, request.userId);
  }

  @Security({
    fromSite: [],
  })
  @Post("sendSubscriptionReminderMail")
  public subscriptionReminderMail(
    @Body() body: SubscriptionRequest
  ): Response {
    return sendSubscriptionReminderMail(body);
  }

  @Security({
    fromSite: [],
  })
  @Post("contacts")
  public addContact(
    @Body() body: AddContactRequest
  ): Response {
    return addContact(body);
  }
}
