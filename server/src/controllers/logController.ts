import { Controller, Get, Route, Query, Security } from "tsoa";
import { getLogs, GetLogResponse } from "../workflows/log/getLogs";
import { ResponseWithData } from "../types/interface";

@Route("logs")
export class LogController extends Controller {
  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Get("/")
  public async get(
    @Query() id: string
  ): ResponseWithData<GetLogResponse[]> {
    return getLogs(id);
  }
}
