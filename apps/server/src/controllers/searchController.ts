import type { UpdateIndexResponse } from "@refugies-info/api-types";
import { Controller, Get, Route } from "tsoa";

import type { ResponseWithData } from "~/types/interface";
import { updateIndex } from "~/workflows/search/updateIndex";

@Route("search")
export class SearchController extends Controller {
  @Get("/update-index")
  public async get(): ResponseWithData<UpdateIndexResponse> {
    return updateIndex();
  }
}
