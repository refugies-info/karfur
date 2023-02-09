import { Controller, Post, Body, Delete, Path, Security } from "tsoa";

import { postNeeds } from "../workflows/needs/postNeeds";
import { deleteNeed } from "../workflows/needs/deleteNeed";
import { addView } from "../workflows/needs/addView";
import { updatePositions, UpdatePositionsNeedResponse } from "../workflows/needs/updatePositions";
import { Picture, Response, ResponseWithData } from "../types/interface";

export interface NeedRequest {
  fr: {
    text: string;
    subtitle: string;
  };
  theme?: string;
  image?: Picture;
  adminComments: string;
}

export interface UpdatePositionsRequest {
  orderedNeedIds: string[];
}

// @Route("needs")
export class NeedController extends Controller {
  // @Security({
  //   fromSite: [],
  //   jwt: ["admin"],
  // })
  // @Post("/")
  // public async post(@Body() body: NeedRequest): ResponseWithData<PostNeedResponse> {
  //   return postNeeds(body);
  // }

  @Security({
    fromSite: [],
    jwt: ["admin"],
  })
  @Delete("{id}")
  public async delete(@Path() id: string): Response {
    return deleteNeed(id);
  }

  @Post("views")
  public async views(@Body() id: string): Response {
    return addView(id);
  }

  @Security({
    fromSite: [],
    jwt: ["admin"],
  })
  @Post("positions")
  public async positions(@Body() body: UpdatePositionsRequest): ResponseWithData<UpdatePositionsNeedResponse[]> {
    return updatePositions(body);
  }
}
