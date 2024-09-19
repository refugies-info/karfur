import {
  GetNeedResponse,
  NeedRequest,
  UpdatePositionsNeedResponse,
  UpdatePositionsRequest,
} from "@refugies-info/api-types";
import * as express from "express";
import { Body, Controller, Delete, Get, Patch, Path, Post, Request, Route, Security } from "tsoa";

import { Response, ResponseWithData } from "~/types/interface";
import { addView, deleteNeed, getNeeds, patchNeed, postNeeds, updatePositions } from "~/workflows/needs";

@Route("needs")
export class NeedController extends Controller {
  @Get("/")
  public async get(): ResponseWithData<GetNeedResponse[]> {
    return getNeeds();
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Post("/")
  public async post(@Body() body: NeedRequest): Response {
    return postNeeds(body);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Delete("{id}")
  public async delete(@Path() id: string): Response {
    return deleteNeed(id);
  }

  @Post("{id}/views")
  public async views(@Path() id: string): Response {
    return addView(id);
  }

  @Security({
    jwt: ["expert"],
  })
  @Patch("{id}")
  public async patch(
    @Path() id: string,
    @Body() body: Partial<NeedRequest>,
    @Request() request: express.Request,
  ): Response {
    return patchNeed(id, body, request.user);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Post("positions")
  public async positions(@Body() body: UpdatePositionsRequest): ResponseWithData<UpdatePositionsNeedResponse[]> {
    return updatePositions(body);
  }
}
