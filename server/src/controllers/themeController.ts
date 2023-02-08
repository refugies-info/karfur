import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  Route,
  Path,
  Security
} from "tsoa";

import { getThemes, Theme as GetTheme } from "../workflows/themes/getThemes";
import { postThemes, Theme as PostTheme } from "../workflows/themes/postThemes";
import { patchTheme, Theme as PatchTheme } from "../workflows/themes/patchTheme";
import { deleteTheme } from "../workflows/themes/deleteTheme";
import { Picture, Response, ResponseWithData, ThemeColors } from "../types/interface";

export interface ThemeParams {
  name: {
    fr: string;
    [key: string]: string
  }
  short: {
    fr: string;
    [key: string]: string
  }
  colors: ThemeColors;
  position: number;
  icon: Picture;
  banner: Picture;
  appBanner: Picture;
  appImage: Picture;
  shareImage: Picture;
  notificationEmoji: string;
  adminComments: string;
}

@Route("themes")
export class ThemeController extends Controller {

  @Get("/")
  public async get(): ResponseWithData<GetTheme[]> {
    return getThemes();
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Post("/")
  public async post(
    @Body() body: ThemeParams
  ): ResponseWithData<PostTheme> {
    return postThemes(body);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Patch("{id}")
  public async patch(
    @Path() id: string,
    @Body() body: Partial<ThemeParams>
  ): ResponseWithData<PatchTheme> {
    return patchTheme(id, body);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Delete("{id}")
  public async delete(
    @Path() id: string
  ): Response {
    return deleteTheme(id);
  }
}
