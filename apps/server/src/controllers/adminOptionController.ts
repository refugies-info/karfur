import { AdminOptionRequest, GetAdminOptionResponse, PostAdminOptionResponse } from "@refugies-info/api-types";
import { Body, Controller, Get, Path, Post, Route, Security } from "tsoa";

import { ResponseWithData } from "~/types/interface";
import { getAdminOptions } from "~/workflows/adminOption/getAdminOptions";
import { postAdminOptions } from "~/workflows/adminOption/postAdminOptions";

@Route("options")
export class AdminOptionController extends Controller {
  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Get("{key}")
  public async get(@Path() key: string): ResponseWithData<GetAdminOptionResponse> {
    return getAdminOptions(key);
  }

  @Security({
    jwt: ["admin"],
    fromSite: [],
  })
  @Post("{key}")
  public async post(@Path() key: string, @Body() body: AdminOptionRequest): ResponseWithData<PostAdminOptionResponse> {
    return postAdminOptions(key, body);
  }
}
