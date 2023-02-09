import {
  Controller,
  Get,
  Post,
  Body,
  Route,
  Path,
  Security
} from "tsoa";

/* TODO: update workflows */
import { getAdminOptions, AdminOption as GetAdminOption } from "../workflows/adminOption/getAdminOptions";
import { postAdminOptions, AdminOption as PostAdminOption } from "../workflows/adminOption/postAdminOptions";
import { ResponseWithData } from "../types/interface";

@Route("options")
export class AdminOptionController extends Controller {

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Get("{key}")
  public async get(
    @Path() key: string,
  ): ResponseWithData<GetAdminOption[]> {
    return getAdminOptions(key);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Post("{key}")
  public async post(
    @Path() key: string,
    @Body() body: { value: any }
  ): ResponseWithData<PostAdminOption> {
    return postAdminOptions(key, body);
  }
}
