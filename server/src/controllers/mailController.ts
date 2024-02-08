import { Controller, Post, Body, Route, Security, Request, Get, Delete } from "tsoa";
import { AddContactRequest, ImprovementsRequest, IsInContactResponse, SubscriptionRequest } from "@refugies-info/api-types";
import { Request as ExRequest } from "express";

import { sendDraftReminderMail } from "../workflows/mail/sendDraftReminderMail";
import { sendReminderMailToUpdateContents } from "../workflows/mail/sendReminderMailToUpdateContents";
import { sendAdminImprovementsMail } from "../workflows/mail/sendAdminImprovementsMail";
import { sendSubscriptionReminderMail } from "../workflows/mail/sendSubscriptionReminderMail";
import { addContact } from "../workflows/mail/addContact";
import { isInContact } from "../workflows/mail/isInContact";
import { deleteContact } from "../workflows/mail/deleteContact";
import { Response, ResponseWithData } from "../types/interface";

@Route("mail")
export class MailController extends Controller {
  @Security({
    fromCron: [],
  })
  @Post("sendDraftReminderMail")
  public draftReminderMail(): Response {
    return sendDraftReminderMail();
  }

  @Security({
    fromCron: [],
  })
  @Post("sendReminderMailToUpdateContents")
  public reminderMailToUpdateContents(): Response {
    return sendReminderMailToUpdateContents();
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Post("sendAdminImprovementsMail")
  public adminImprovementsMail(@Body() body: ImprovementsRequest, @Request() request: ExRequest): Response {
    return sendAdminImprovementsMail(body, request.userId);
  }

  @Security({
    fromSite: [],
  })
  @Post("sendSubscriptionReminderMail")
  public subscriptionReminderMail(@Body() body: SubscriptionRequest): Response {
    return sendSubscriptionReminderMail(body);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Get("contacts")
  public async isInContact(@Request() request: ExRequest): ResponseWithData<IsInContactResponse> {
    const isInContacts = await isInContact(request.user);
    return { text: "success", data: { isInContacts } };
  }
  @Security({
    jwt: [],
    fromSite: [],
  })
  @Delete("contacts")
  public async deleteContact(@Request() request: ExRequest): Response {
    await deleteContact(request.user);
    return { text: "success" };
  }
  @Security({
    fromSite: [],
  })
  @Post("contacts")
  public async addContact(@Body() body: AddContactRequest): Response {
    await addContact(body);
    return { text: "success" };
  }
}
