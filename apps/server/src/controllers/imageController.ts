import type { PostImageResponse } from "@refugies-info/api-types";
import type * as express from "express";
import { Controller, Post, Request, Route, Security } from "tsoa";

import type { ResponseWithData } from "~/types/interface";
import { postImages, type UploadedFile } from "~/workflows/images/postImages";

@Route("images")
export class ImageController extends Controller {
  @Security({
    fromSite: [],
  })
  @Post("/")
  public async post(@Request() request: express.Request): ResponseWithData<PostImageResponse> {
    return postImages(request.files as unknown as UploadedFile[]);
  }
}
