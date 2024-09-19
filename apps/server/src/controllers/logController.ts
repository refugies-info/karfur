import { GetLogResponse } from "@refugies-info/api-types";
import { Controller, Get, Query, Route, Security } from "tsoa";

import { ResponseWithData } from "~/types/interface";
import { getLogs } from "~/workflows/log/getLogs";

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
