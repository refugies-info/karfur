import { GetWidgetResponse, PatchWidgetResponse, PostWidgetResponse, WidgetRequest } from "@refugies-info/api-types";
import * as express from "express";
import { Body, Controller, Delete, Get, Patch, Path, Post, Request, Route, Security } from "tsoa";

import { IRequest, Response, ResponseWithData } from "~/types/interface";
import { deleteWidget } from "~/workflows/widget/deleteWidget";
import { getWidgets } from "~/workflows/widget/getWidgets";
import { patchWidget } from "~/workflows/widget/patchWidget";
import { postWidgets } from "~/workflows/widget/postWidgets";

@Route("widgets")
export class WidgetController extends Controller {
  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Get("/")
  public async get(): ResponseWithData<GetWidgetResponse[]> {
    return getWidgets();
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Post("/")
  public async post(@Body() body: WidgetRequest, @Request() request: IRequest): ResponseWithData<PostWidgetResponse> {
    return postWidgets(body, request.userId);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Patch("{id}")
  public async patch(
    @Path() id: string,
    @Body() body: Partial<WidgetRequest>,
    @Request() request: express.Request,
  ): ResponseWithData<PatchWidgetResponse> {
    return patchWidget(id, body, request.userId);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Delete("{id}")
  public async delete(@Path() id: string): Response {
    return deleteWidget(id);
  }
}
