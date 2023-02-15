import {
  Controller,
  Get,
  Route,
  Request,
  Query,
  Security
} from "tsoa";
import express, { Request as ExRequest } from "express";
const router = express.Router();
const checkToken = require("./account/checkToken");
import { getAllStructures, GetAllStructuresResponse } from "../workflows/structure/getAllStructures";
import { getStructureById, StructureById } from "../workflows/structure/getStructureById";
import { getActiveStructures, GetActiveStructuresResponse } from "../workflows/structure/getActiveStructures";
import { createStructure } from "../workflows/structure/createStructure";
import { updateStructure } from "../workflows/structure/updateStructure";
import { modifyUserRoleInStructure } from "../workflows/structure/modifyUserRoleInStructure";
import getStatistics from "../workflows/structure/getStatistics";
import { ResponseWithData } from "../types/interface";

/* TODO: use tsoa */

router.post("/createStructure", checkToken.check, createStructure);
router.post("/updateStructure", checkToken.check, updateStructure);
router.post("/modifyUserRoleInStructure", checkToken.check, modifyUserRoleInStructure);
router.get("/statistics", getStatistics);

export { router };

@Route("structures")
export class StructureController extends Controller {

  @Security({
    jwt: ["admin"],
  })
  @Get("/all")
  public async getAll(): ResponseWithData<GetAllStructuresResponse[]> {
    return getAllStructures();
  }

  @Get("/getStructureById")
  public async getStructure(
    @Query() id: string,
    @Query() withDisposAssocies: boolean,
    @Query() localeOfLocalizedDispositifsAssocies: string,
    @Query() withMembres: boolean,
    @Request() request: ExRequest
  ): ResponseWithData<StructureById> {
    return getStructureById(id, withDisposAssocies, localeOfLocalizedDispositifsAssocies, withMembres, request.user);
  }

  @Get("/getActiveStructures")
  public async getStructures(): ResponseWithData<GetActiveStructuresResponse> {
    return getActiveStructures();
  }
}

