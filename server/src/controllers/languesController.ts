import { Controller, Get, Route } from "tsoa";

import { getLanguages, GetLanguagesResponse } from "../workflows/langues/getLanguages";
import { ResponseWithData } from "../types/interface";

@Route("langues")
export class LanguesController extends Controller {
  @Get("/")
  public async get(): ResponseWithData<GetLanguagesResponse[]> {
    return getLanguages();
  }
}
