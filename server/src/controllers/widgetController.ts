import { Controller, Get, Post, Patch, Body, Delete, Route, Path, Security, Request } from "tsoa";
import * as express from "express";
import { getWidgets, GetWidgetResponse } from "../workflows/widget/getWidgets";
import { postWidgets, PostWidgetResponse } from "../workflows/widget/postWidgets";
import { patchWidget, PatchWidgetResponse } from "../workflows/widget/patchWidget";
import { deleteWidget } from "../workflows/widget/deleteWidget";
import { Id, IRequest, Response, ResponseWithData } from "../types/interface";

export interface WidgetRequest {
  name: string;
  themes: Id[];
  typeContenu: ("dispositif" | "demarche")[];
  languages?: string[];
  department?: string;
}

@Route("widgets")
export class WidgetController extends Controller {
  @Security({
    fromSite: [],
    jwt: ["admin"],
  })
  @Get("/")
  public async get(): ResponseWithData<GetWidgetResponse[]> {
    return getWidgets();
  }

  @Security({
    fromSite: [],
    jwt: ["admin"],
  })
  @Post("/")
  public async post(@Body() body: WidgetRequest, @Request() request: IRequest): ResponseWithData<PostWidgetResponse> {
    return postWidgets(body, request.userId);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"],
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
    fromSite: [],
    jwt: ["admin"],
  })
  @Delete("{id}")
  public async delete(@Path() id: string): Response {
    return deleteWidget(id);
  }
}
