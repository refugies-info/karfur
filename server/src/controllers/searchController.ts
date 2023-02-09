import { Controller, Get, Route } from "tsoa";

import { updateIndex, UpdateIndexResponse } from "../workflows/search/updateIndex";
import { ResponseWithData } from "../types/interface";

@Route("search")
export class SearchController extends Controller {
  @Get("/update-index")
  public async get(): ResponseWithData<UpdateIndexResponse> {
    return updateIndex();
  }
}
