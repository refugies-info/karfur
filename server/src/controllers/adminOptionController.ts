// import { Controller, Get, Post, Body, Route, Path, Security } from "tsoa";

// import { getAdminOptions, GetAdminOptionResponse } from "../workflows/adminOption/getAdminOptions";
// import { postAdminOptions, PostAdminOptionResponse } from "../workflows/adminOption/postAdminOptions";
// import { ResponseWithData } from "../types/interface";

export interface AdminOptionRequest {
  value: any;
}

// // @Route("options")
// export class AdminOptionController extends Controller {
//   @Security({
//     fromSite: [],
//     jwt: ["admin"]
//   })
//   @Get("{key}")
//   public async get(@Path() key: string): ResponseWithData<GetAdminOptionResponse> {
//     return getAdminOptions(key);
//   }

//   @Security({
//     fromSite: [],
//     jwt: ["admin"]
//   })
//   @Post("{key}")
//   public async post(@Path() key: string, @Body() body: AdminOptionRequest): ResponseWithData<PostAdminOptionResponse> {
//     return postAdminOptions(key, body);
//   }
// }
