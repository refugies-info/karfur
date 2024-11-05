import { GetThemeResponse, PatchThemeResponse, PostThemeResponse, ThemeRequest } from "@refugies-info/api-types";
import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Security } from "tsoa";

import { Response, ResponseWithData } from "~/types/interface";
import { deleteTheme } from "~/workflows/themes/deleteTheme";
import { getThemes } from "~/workflows/themes/getThemes";
import { patchTheme } from "~/workflows/themes/patchTheme";
import { postThemes } from "~/workflows/themes/postThemes";

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
