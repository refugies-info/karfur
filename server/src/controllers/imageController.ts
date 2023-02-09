import { ResponseWithData } from "../types/interface";
import { postImages, PostImageResponse } from "../workflows/images/postImages";
import {
  Controller,
  Post,
  Route,
  Security,
  Request
} from "tsoa";
import * as express from "express";


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
