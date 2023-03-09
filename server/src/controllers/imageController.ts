import { Controller, Post, Route, Security, Request } from "tsoa";
import { PostImageResponse } from "api-types";
import * as express from "express";

import { ResponseWithData } from "../types/interface";
import { postImages } from "../workflows/images/postImages";


@Route("images")
export class ImageController extends Controller {

  @Security({
    fromSite: [],
  })
  @Post("/")
  public async post(
    @Request() request: express.Request
  ): ResponseWithData<PostImageResponse> {
    return postImages(request.files);
  }
}
