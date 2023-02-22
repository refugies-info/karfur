import { Controller, Get, Route, Request, Query, Security, Path, Queries, Post, Body } from "tsoa";
import express, { Request as ExRequest } from "express";

const router = express.Router();
const checkToken = require("./account/checkToken");
import { getAllStructures, GetAllStructuresResponse } from "../workflows/structure/getAllStructures";
import { getStructureById, GetStructureResponse } from "../workflows/structure/getStructureById";
import { getActiveStructures, GetActiveStructuresResponse } from "../workflows/structure/getActiveStructures";
import { createStructure } from "../workflows/structure/createStructure";
import { updateStructure } from "../workflows/structure/updateStructure";
import { modifyUserRoleInStructure } from "../workflows/structure/modifyUserRoleInStructure";
import { getStatistics, GetStructureStatisticsResponse } from "../workflows/structure/getStatistics";
import { IRequest, Picture, Response, ResponseWithData } from "../types/interface";

/* TODO: use tsoa */
router.post("/updateStructure", checkToken.check, updateStructure);
router.post("/modifyUserRoleInStructure", checkToken.check, modifyUserRoleInStructure);

export { router };

type StructureFacets = "nbStructures" | "nbCDA" | "nbStructureAdmins";
export interface GetStructureStatisticsRequest {
  facets?: StructureFacets[];
}

export interface PostStructureRequest {
  picture: Picture | null;
  contact: string;
  phone_contact: string;
  mail_contact: string;
  responsable: string | null;
  nom: string;
}

@Route("structures")
export class StructureController extends Controller {
  @Security({
    jwt: ["admin"],
    fromSite: []
  })
  @Post("/")
  public async createStructure(@Body() body: PostStructureRequest, @Request() request: IRequest): Response {
    return createStructure(body, request.userId);
  }

  @Security({
    jwt: ["admin"],
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
}
