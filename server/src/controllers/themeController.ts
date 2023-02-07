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
import { Response, ResponseWithData } from "../types/interface";

interface Image {
  secure_url: string;
  public_id: string;
  imgId: string;
}

export interface ThemeParams {
  name: {
    fr: string;
    [key: string]: string
  }
  short: {
    fr: string;
    [key: string]: string
  }
  colors: {
    color100: string;
    color80: string;
    color60: string;
    color40: string;
    color30: string;
  };
  position: number;
  icon: Image;
  banner: Image;
  appBanner: Image;
  appImage: Image;
  shareImage: Image;
  notificationEmoji: string;
  adminComments: string;
}

@Route("themes")
export class ThemeController extends Controller {

  @Get("/")
  public async get(): Promise<ResponseWithData<GetTheme[]>> {
    return getThemes();
  }

  @Security("jwt", ["admin"])
  @Post("/")
  public async post(
    @Body() body: ThemeParams
  ): Promise<ResponseWithData<PostTheme>> {
    return postThemes(body);
  }

  @Security("jwt", ["admin"])
  @Patch("{id}")
  public async patch(
    @Path() id: string,
    @Body() body: Partial<ThemeParams>
  ): Promise<ResponseWithData<PatchTheme>> {
    return patchTheme(id, body);
  }

  @Security("jwt", ["admin"])
  @Delete("{id}")
  public async delete(
    @Path() id: string
  ): Promise<Response> {
    return deleteTheme(id);
  }
}
