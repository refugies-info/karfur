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
import { Body, Controller, Get, Patch, Path, Post, Queries, Query, Request, Route, Security } from "tsoa";

import { IRequest, Response, ResponseWithData } from "~/types/interface";
import { createStructure } from "~/workflows/structure/createStructure";
import { getActiveStructures } from "~/workflows/structure/getActiveStructures";
import { getAllStructures } from "~/workflows/structure/getAllStructures";
import { getStatistics } from "~/workflows/structure/getStatistics";
import { getStructureById } from "~/workflows/structure/getStructureById";
import { modifyUserRoleInStructure } from "~/workflows/structure/modifyUserRoleInStructure";
import { updateStructure } from "~/workflows/structure/updateStructure";

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
