import { Controller, Get, Post, Patch, Body, Delete, Route, Path, Security } from "tsoa";
import { GetThemeResponse, PatchThemeResponse, PostThemeResponse, ThemeRequest } from "api-types";

import { getThemes } from "../workflows/themes/getThemes";
import { postThemes } from "../workflows/themes/postThemes";
import { patchTheme } from "../workflows/themes/patchTheme";
import { deleteTheme } from "../workflows/themes/deleteTheme";
import { Response, ResponseWithData } from "../types/interface";

@Route("themes")
export class ThemeController extends Controller {
  @Get("/")
  public async get(): ResponseWithData<GetThemeResponse[]> {
    return getThemes();
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Post("/")
  public async post(@Body() body: ThemeRequest): ResponseWithData<PostThemeResponse> {
    return postThemes(body);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Patch("{id}")
  public async patch(@Path() id: string, @Body() body: Partial<ThemeRequest>): ResponseWithData<PatchThemeResponse> {
    return patchTheme(id, body);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Delete("{id}")
  public async delete(@Path() id: string): Response {
    return deleteTheme(id);
  }
}
