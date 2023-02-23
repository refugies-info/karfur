import { Controller, Get, Post, Body, Route, Path, Security } from "tsoa";
import { AdminOptionRequest, GetAdminOptionResponse, PostAdminOptionResponse } from "api-types";

import { getAdminOptions } from "../workflows/adminOption/getAdminOptions";
import { postAdminOptions } from "../workflows/adminOption/postAdminOptions";
import { ResponseWithData } from "../types/interface";

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
