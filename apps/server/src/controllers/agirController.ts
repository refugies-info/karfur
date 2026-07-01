import type { AgirOperatorsSyncResponse } from "@refugies-info/api-types";
import { Controller, Post, Route, Security } from "tsoa";

import type { ResponseWithData } from "~/types/interface";
import { syncAgirOperators } from "~/workflows/agir/syncAgirOperators";

@Route("agir/operators")
export class AgirController extends Controller {
  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Post("sync")
  public async sync(): ResponseWithData<AgirOperatorsSyncResponse> {
    const data = await syncAgirOperators();

    return {
      text: "success",
      data,
    };
  }

  @Security({
    fromCron: [],
  })
  @Post("sync/cron")
  public async syncFromCron(): ResponseWithData<AgirOperatorsSyncResponse> {
    const data = await syncAgirOperators();

    return {
      text: "success",
      data,
    };
  }
}
