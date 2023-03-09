import { Controller, Get, Route } from "tsoa";
import { GetLanguagesResponse } from "api-types";

import { getLanguages } from "../workflows/langues/getLanguages";
import { ResponseWithData } from "../types/interface";

@Route("langues")
export class LanguesController extends Controller {
  @Get("/")
  public async get(): ResponseWithData<GetLanguagesResponse[]> {
    return getLanguages();
  }
}
