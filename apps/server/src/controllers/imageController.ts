import { PostImageResponse } from "@refugies-info/api-types";
import * as express from "express";
import { Controller, Post, Request, Route, Security } from "tsoa";

import { ResponseWithData } from "~/types/interface";
import { postImages } from "~/workflows/images/postImages";

@Route("images")
export class ImageController extends Controller {
  @Security({
    fromSite: [],
  })
  @Post("/")
  public async post(@Request() request: express.Request): ResponseWithData<PostImageResponse> {
    return postImages(request.files);
  }
}
