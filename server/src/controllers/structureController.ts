import { Controller, Get, Route, Request, Query, Security, Path, Queries, Post, Body, Patch } from "tsoa";
import {
  GetActiveStructuresResponse,
  GetAllStructuresResponse,
  GetStructureResponse,
  GetStructureStatisticsRequest,
  GetStructureStatisticsResponse,
  PatchStructureRequest,
  PatchStructureRolesRequest,
  PostStructureRequest,
} from "@refugies-info/api-types";
import { Request as ExRequest } from "express";

import { getAllStructures } from "../workflows/structure/getAllStructures";
import { getStructureById } from "../workflows/structure/getStructureById";
import { getActiveStructures } from "../workflows/structure/getActiveStructures";
import { createStructure } from "../workflows/structure/createStructure";
import { updateStructure } from "../workflows/structure/updateStructure";
import { modifyUserRoleInStructure } from "../workflows/structure/modifyUserRoleInStructure";
import { getStatistics } from "../workflows/structure/getStatistics";
import { IRequest, Response, ResponseWithData } from "../types/interface";

@Route("structures")
export class StructureController extends Controller {
  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Post("/")
  public async createStructure(@Body() body: PostStructureRequest, @Request() request: IRequest): Response {
    return createStructure(body, request.userId);
  }

  @Security({
    jwt: [],
  })
  @Get("/all")
  public async getAll(): ResponseWithData<GetAllStructuresResponse[]> {
    return getAllStructures();
  }

  @Get("/getActiveStructures")
  public async getStructures(): ResponseWithData<GetActiveStructuresResponse[]> {
    return getActiveStructures();
  }

  @Get("/statistics")
  public async getStructuresStatistics(
    @Queries() query: GetStructureStatisticsRequest,
  ): ResponseWithData<GetStructureStatisticsResponse> {
    return getStatistics(query);
  }

  @Security({
    jwt: ["optional"],
  })
  @Get("{id}")
  public async getStructure(
    @Path() id: string,
    @Query() locale: string,
    @Request() request: ExRequest,
  ): ResponseWithData<GetStructureResponse> {
    return getStructureById(id, locale, request.user);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Patch("{id}")
  public async updateStructure(
    @Path() id: string,
    @Body() body: PatchStructureRequest,
    @Request() request: ExRequest,
  ): Response {
    return updateStructure(id, body, request.user);
  }

  @Security({
    jwt: [],
    fromSite: [],
  })
  @Patch("{id}/roles")
  public async updateRoles(
    @Path() id: string,
    @Body() body: PatchStructureRolesRequest,
    @Request() request: ExRequest,
  ): Response {
    return modifyUserRoleInStructure(id, body, request.user);
  }
}
