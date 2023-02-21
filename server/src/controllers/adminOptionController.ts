import { Controller, Get, Post, Body, Route, Path, Security } from "tsoa";

import { getAdminOptions, GetAdminOptionResponse } from "../workflows/adminOption/getAdminOptions";
import { postAdminOptions, PostAdminOptionResponse } from "../workflows/adminOption/postAdminOptions";
import { ResponseWithData } from "../types/interface";

export interface AdminOptionRequest {
  value: any;
}

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
