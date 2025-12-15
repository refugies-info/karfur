import type { GetLanguagesResponse } from "@refugies-info/api-types";
import { Controller, Get, Route } from "tsoa";

import type { ResponseWithData } from "~/types/interface";
import { getLanguages } from "~/workflows/langues/getLanguages";

@Route("langues")
export class LanguesController extends Controller {
  @Get("/")
  public async get(): ResponseWithData<GetLanguagesResponse[]> {
    return getLanguages();
  }
}
