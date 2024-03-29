import { Controller, Get, Route, Query, Security } from "tsoa";
import { GetLogResponse } from "@refugies-info/api-types";

import { getLogs } from "../workflows/log/getLogs";
import { ResponseWithData } from "../types/interface";

@Route("logs")
export class LogController extends Controller {
  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Get("/")
  public async get(@Query() id: string): ResponseWithData<GetLogResponse[]> {
    return getLogs(id);
  }
}
