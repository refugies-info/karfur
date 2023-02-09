import {
  Controller,
  Get,
  Route
} from "tsoa";

/* TODO: update workflows */
import { updateIndex, Result } from "../workflows/search/updateIndex";
import { ResponseWithData } from "../types/interface";

@Route("search")
export class SearchController extends Controller {
  @Get("/update-index")
  public async get(): ResponseWithData<Result[]> {
    return updateIndex();
  }
}
